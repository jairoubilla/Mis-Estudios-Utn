import { Input } from '../components/ui/input';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useForm } from 'react-hook-form';
import { Label } from '../components/ui/Label';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container } from '../components/ui';


function RegisterPage() {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const { signup, errors: setUserErrors } = useAuth();
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async (data) => {
        const user = await signup(data);
        if(user){
            navigate("/perfil");  
        }
        
    });

    return (
        <Container className='h-[calc(100vh-10rem)] flex items-center justify-center'>
            <Card>

                {errors && errors.map((error) => (
                    <p className='bg-red-500 text-white p-2'>{error}</p>
                ))
                }
                <h3 className='text-4xl font-bold my-2'>Registro</h3>
                <form onSubmit={onSubmit}>

                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Ingrese su nombre" {...register("name", { required: true })}></Input>

                    {errors.name && <p className="text-red-500">El nombre es obligatorio</p>}

                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Ingrese su email" {...register("email", { required: true })}></Input>

                    {errors.email && <p className="text-red-500">El email es obligatorio</p>}

                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" placeholder="Ingrese su password" {...register("password", { required: true })}></Input>

                    {errors.password && <p className="text-red-500">La contraseña es obligatoria</p>}

                    <Button>Registrarse</Button>

                </form>
                <div className='flex justify-between my-4'>
                    <p>¿Ya tienes cuenta?</p>
                    <Link to="/login">Iniciar Sesión</Link>
                </div>
            </Card>
        </Container>
    );
}

export default RegisterPage