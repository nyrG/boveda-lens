import { Routes } from "@angular/router";
import { Login } from "./pages/login/login";
import { Profile } from "./pages/profile/profile";
import { authGuard } from "./guards/auth-guard";
import { Dashboard } from "./pages/dashboard/dashboard";
import { Settings } from "./pages/settings/settings";
import { Docs } from "./pages/docs/docs";
import { Records } from "./pages/records/records";
import { RecordDetail } from "./pages/record-detail/record-detail";

export const routes: Routes = [
    { path: "login", component: Login },
    //Main Pages
    { path: "dashboard", component: Dashboard, canActivate: [authGuard] },
    { path: "records", component: Records, canActivate: [authGuard] },
    { path: "records/:id", component: RecordDetail, canActivate: [authGuard] },
    //Settings Pages
    { path: "profile", component: Profile, canActivate: [authGuard] },
    { path: "settings", component: Settings, canActivate: [authGuard] },
    { path: "docs", component: Docs, canActivate: [authGuard] },
    //Redirect to dashboard if logged in, otherwise to login
    { path: "", redirectTo: "/dashboard", pathMatch: "full" },
];
