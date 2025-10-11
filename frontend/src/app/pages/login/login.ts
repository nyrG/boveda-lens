import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule], // Import FormsModule for ngModel
  templateUrl: "./login.html",
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = { username: "", pass: "" };
  errorMessage = "";

  onSubmit() {
    this.errorMessage = ""; // Reset error message
    this.authService.login(this.credentials).subscribe({
      next: () => {
        // On successful login, navigate to the main dashboard.
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        console.error("Login failed", err);
        this.errorMessage = "Invalid username or password. Please try again.";
      },
    });
  }
}