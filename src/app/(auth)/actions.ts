"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function validatePassword(password: string): string | null {
    if (password.length < 8) return "Şifre en az 8 karakter olmalıdır.";
    if (!/[A-Z]/.test(password)) return "Şifre en az 1 büyük harf içermelidir.";
    if (!/[0-9]/.test(password)) return "Şifre en az 1 rakam içermelidir.";
    return null;
}

const SUPABASE_CONFIGURED =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") ?? false;

export async function login(formData: FormData) {
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!email) return { error: "E-posta adresi zorunludur." };

    const passwordError = validatePassword(password);
    if (passwordError) return { error: passwordError };

    // Dev mode: Supabase yapılandırılmamışsa doğrudan dashboard'a yönlendir
    if (!SUPABASE_CONFIGURED) {
        revalidatePath("/", "layout");
        redirect("/dashboard");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        if (error.message === "Invalid login credentials") {
            return { error: "E-posta veya şifre hatalı." };
        }
        if (error.message === "Email not confirmed") {
            return { error: "E-posta adresiniz henüz doğrulanmamış. Gelen kutunuzu kontrol edin." };
        }
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function register(formData: FormData) {
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const companyName = formData.get("companyName") as string;
    const accountType = formData.get("accountType") as string;

    if (!email) return { error: "E-posta adresi zorunludur." };

    const passwordError = validatePassword(password);
    if (passwordError) return { error: passwordError };

    // Dev mode: Supabase yapılandırılmamışsa doğrudan dashboard'a yönlendir
    if (!SUPABASE_CONFIGURED) {
        revalidatePath("/", "layout");
        redirect("/dashboard");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                company_name: companyName,
                account_type: accountType,
            },
        },
    });

    if (error) {
        if (error.message === "User already registered") {
            return { error: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin." };
        }
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/login?message=E-posta adresinizi doğrulamak için gelen kutunuzu kontrol edin.");
}
