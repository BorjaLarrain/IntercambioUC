import { createContext, useEffect, useState, useContext } from "react";
import supabase from "../config/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);

    // Va actualizando el valor de "session"
    useEffect(() => {
        // Se obtiene la sesión actual
        supabase.auth.getSession().then(({ data: { session } }) => {
            // Se actualiza el estado de "session"
            setSession(session)
        })

        // Se "escuchan" cambios en tiempo real en torno a la autenticación
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()

    }, [])

    // Función para crear cuenta (SignUp) (notar que es pasada hacia el componente "SignUp.jsx")
    const signUpNewUser = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            return { success: false, data, error }
        }

        return { success: true, data, error }
    }

    // Función para iniciar sesión (con email)
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            return { success: false, data, error }
        }

        return { success: true, data, error }
    }

    // Función para iniciar sesión (con Google)
    const signInGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });

        if (error) {
            console.log("Hubo un error creando la cuenta")
            return { success: false, data }
        }

        return { success: true, data }
    }

    // Función para cerrar sesión
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log("ERROR AL CERRAR SESIÓN");
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signIn, signInGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook
// En vez de tener que importar y usar useContext(AuthContext) en cada componente,
// simplemente se importa y se llama a UserAuth().
// Ejemplo de uso: const { session } = UserAuth();
export const UserAuth = () => {
    return useContext(AuthContext);
}