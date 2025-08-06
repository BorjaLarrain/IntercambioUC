import { createContext, useEffect, useState, useContext } from "react";
import supabase from "../config/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);

    // Función para guardar el nombre de usuario de Google en la tabla profiles
    const saveGoogleUsername = async (user) => {
        if (!user || !user.user_metadata) return;

        // Extraer el nombre del usuario de Google
        const googleName = user.user_metadata.full_name || user.user_metadata.name;

        if (!googleName) return;

        try {
            // Verificar si ya existe un perfil para este usuario
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();

            // Solo actualizar si no tiene username o si el username está vacío
            if (!existingProfile || !existingProfile.username) {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        username: googleName,
                        email: user.email,
                        updated_at: new Date()
                    });

                if (error) {
                    console.error('Error al guardar el nombre de usuario de Google:', error);
                } else {
                    console.log('Nombre de usuario de Google guardado exitosamente:', googleName);
                }
            }
        } catch (error) {
            console.error('Error al procesar el perfil de Google:', error);
        }
    };

    // Va actualizando el valor de "session"
    useEffect(() => {
        // Se obtiene la sesión actual
        supabase.auth.getSession().then(({ data: { session } }) => {
            // Se actualiza el estado de "session"
            setSession(session);

            // Si hay sesión y es un usuario de Google, guardar el nombre
            if (session?.user && session.user.app_metadata?.provider === 'google') {
                saveGoogleUsername(session.user);
            }
        });

        // Se "escuchan" cambios en tiempo real en torno a la autenticación
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);

            // Si hay sesión y es un usuario de Google, guardar el nombre
            if (session?.user && session.user.app_metadata?.provider === 'google') {
                saveGoogleUsername(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Función para crear cuenta (SignUp) (notar que es pasada hacia el componente "SignUp.jsx")
    const signUpNewUser = async (email, password, username) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
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