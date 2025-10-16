import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ExtractedPatientData } from '../patients/types/patient.types';
import { allCategories, diagnosisList, schema } from './extraction.constants';
import { DocumentType } from './dto/upload-options.dto';
import { recursiveClean, sanitizeJsonString } from './utils/extraction.utils';

@Injectable()
export class ExtractionService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not configured in the .env file.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Applies specific business logic and formatting rules to the extracted data.
   */
  private cleanData(data: ExtractedPatientData): ExtractedPatientData {
    // 1. Perform a deep, generic clean first.
    const cleanedData = recursiveClean(data);

    // 2. Apply specific formatting to the known structure.
    const formatMiddleInitial = (fullNameObject: { middle_initial?: string } | undefined) => {
      if (fullNameObject && fullNameObject.middle_initial) {
        fullNameObject.middle_initial = fullNameObject.middle_initial.charAt(0).toUpperCase();
      }
    };

    formatMiddleInitial(cleanedData.patient_info?.full_name);
    formatMiddleInitial(cleanedData.sponsor_info?.sponsor_name);

    const standardizeSex = (infoObject: { sex?: string | null } | undefined) => {
      if (infoObject && typeof infoObject.sex === 'string') {
        const sex = infoObject.sex.toLowerCase();
        if (sex.startsWith('m')) infoObject.sex = 'M';
        else if (sex.startsWith('f')) infoObject.sex = 'F';
        else infoObject.sex = null;
      }
    };

    standardizeSex(cleanedData.patient_info);
    standardizeSex(cleanedData.sponsor_info);

    return cleanedData;
  }

  async extractDataFromPdf(
    file: Express.Multer.File,
    modelName: string,
    documentType: DocumentType,
  ): Promise<ExtractedPatientData> {
    let documentTypeInstruction: string;
    switch (documentType) {
      case DocumentType.MILITARY:
        documentTypeInstruction = `5. **This is a Military Personnel document**: ALL military information (rank, afpsn, branch_of_service, unit_assignment) MUST be placed in the 'patient_info' object. The 'sponsor_info' object should be used for dependent information if present, but should not contain the primary military details.`;
        break;
      case DocumentType.DEPENDENT:
        documentTypeInstruction = `5. **CRITICAL INSTRUCTION: This is a Sponsored Dependent document.** The patient is NOT the military member. ALL military information (rank, afpsn, branch of service, unit assignment) found anywhere in this document MUST be placed in the 'sponsor_info' object. The corresponding military fields in the 'patient_info' object MUST be set to null. There are no exceptions to this rule.`;
        break;
      default:
        documentTypeInstruction = `5. **General Document Handling**: This is a general medical document. Extract all information for the primary patient into the 'patient_info' object. If the document explicitly mentions a sponsor or guarantor, place their details in the 'sponsor_info' object. Do not assume a military context unless military-specific identifiers (like rank, AFPSN, branch of service) are clearly present.`;
        break;
    }

    const prompt = `
      You are an expert AI medical data processor. Analyze the provided PDF, including all handwritten text, and convert it into a single, comprehensive JSON object.

      **PRIMARY RULES:**
      1.  **Strict Schema Adherence**: Your output MUST be ONLY the raw JSON object, strictly following the provided schema. If a value is not found or is illegible, it must be null.
      2.  **Data Quality and Coherence**: All extracted text must be proofread to correct OCR errors, ensure it is coherent, and written in English.
      3.  **Handle Document Layout**: Pay close attention to the document's layout. Often, the value for a field is written on the line ABOVE its corresponding label (e.g., the name "MEDINA" appears above the label "LAST NAME").
      4.  **No Extra Text**: Your final output must only be the raw JSON object.
      ${documentTypeInstruction}
      
      **FIELD-SPECIFIC INSTRUCTIONS:**
      - **documented_age**: Extract the patient's age exactly as it is written in the document. This is separate from any age you might calculate from the date of birth. If the document states an age, capture that specific number here.
      - **branch_of_service**: This may be abbreviated as "br of svc" in the document.
      - **address**: Deconstruct the address into its specific components: house_no_street, barangay, city_municipality, province, and zip_code.
      - **sex (for both patient and sponsor)**: If sex is not explicitly written, infer it from the person's first name. Standardize the output to "M" for male, "F" for female, or null if it cannot be determined.
      - **summary.final_diagnosis**: First, try to match the condition to one or more items from the provided Diagnosis List. If no match is found, formulate a concise diagnosis based on the document's findings as a last resort. Return as a JSON array.
      - **summary.medications_taken**: Extract a list of medications from the most recent 'Treatment Plan'. Each item must be a string including the name, dosage, and frequency.
      - **patient_info.category**: You MUST select the most fitting category from the provided Category List.
      - **full_name properties (for both patient and sponsor)**: These fields can contain multiple words (e.g., "AMGGYMEL VHANESA" or "JOSE RIZAL"). You must extract all parts of the first name into the single "first_name" property.
      - **dates**: All dates must be in "YYYY-MM-DD" format (e.g., "13-Oct-91" becomes "1991-10-13").
      - **Laboratory Results**: Extract each individual test from a lab report table. For each test, you must separate the numerical result from its unit. For example, for "75.20 µmol/L", the "value" should be "75.20" and the "unit" should be "µmol/L".
      
      **CONSULTATION FIELD DEFINITIONS:**
      - **chief_complaint**: The patient's primary reason for the visit, in their own words or as recorded by the physician.
      - **diagnosis**: The physician's assessment or diagnosis for that specific encounter.
      - **notes**: The detailed narrative of the patient's history for the current illness (History of Present Illness or HPI), physical exam findings, and other relevant details from the consultation.
      - **treatment_plan**: The specific actions, prescriptions, or advice given to the patient during that consultation.

      **REFERENCE LISTS:**
      - **Diagnosis List**: ${diagnosisList.join(', ')}
      - **Category List**: ${allCategories.join(', ')}

      **DATA QUALITY INSTRUCTIONS:**
      - **Decipher Handwriting**: Make your best effort to accurately interpret handwritten notes.
      - **Proofread All Consultation Fields**: For all free-text fields within the "consultations" object (like 'chief_complaint', 'diagnosis', 'notes', and 'treatment_plan'), you must first extract the raw text, then proofread and rewrite it into a coherent, clinical narrative. Correct all spelling and grammar mistakes from the OCR process.
      - **Ensure Coherence**: Proofread the extracted data to be legible and coherent. All output must be in English. If a value is illegible, set it to null.
      
      **JSON SCHEMA TO FOLLOW:**
      ${JSON.stringify(schema, null, 2)}
    `;

    const model = this.genAI.getGenerativeModel({
      model: modelName,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const fileDataPart = {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    };

    const result = await model.generateContent([prompt, fileDataPart]);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error('No valid JSON object found in Gemini response:', responseText);
      throw new InternalServerErrorException(
        'Could not find a valid JSON object in the extracted data.',
      );
    }

    const sanitizedJson = sanitizeJsonString(jsonMatch[0]);

    try {
      const parsedData = JSON.parse(sanitizedJson) as ExtractedPatientData;
      const cleanedData = this.cleanData(parsedData);

      cleanedData.extraction_info = {
        model_used: modelName,
        processed_at: new Date().toISOString(),
      };

      return cleanedData;
    } catch (error) {
      console.error('Failed to parse JSON from Gemini:', error, 'Raw Text:', sanitizedJson);
      throw new InternalServerErrorException(
        'Could not parse the extracted data from the AI response.',
      );
    }
  }
}
