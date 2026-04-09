// import { Link, useNavigate } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
// import { useAuth } from '../context/AuthContext'

// function Login() {
//     const { register, handleSubmit, formState: { errors } } = useForm()
//     const { login } = useAuth()
//     const navigate = useNavigate()

//     const onSubmit = async (data) => {
//         await login(data.email, data.password)
//         navigate('/')
//     }

//     return (
//         <div className="flex justify-center items-center py-20 bg-base-200 min-h-[calc(100vh-64px)]">
//             <div className="card w-80 bg-base-100 border border-base-300">
//                 <div className="text-center pt-6">
//                     <h1 className="text-3xl font-bold">Login now!</h1>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="card-body">
//                     <div className="form-control">
//                         <label className="label"><span className="label-text">Email</span></label>
//                         <input
//                             type="email"
//                             placeholder="email"
//                             className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
//                             {...register('email', {
//                                 required: 'Email is required',
//                                 pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
//                             })}
//                         />
//                         {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
//                     </div>

//                     <div className="form-control">
//                         <label className="label"><span className="label-text">Password</span></label>
//                         <input
//                             type="password"
//                             placeholder="password"
//                             className={`input input-bordered ${errors.password ? 'input-error' : ''}`}
//                             {...register('password', {
//                                 required: 'Password is required',
//                                 minLength: { value: 6, message: 'Minimum 6 characters' }
//                             })}
//                         />
//                         {errors.password && <span className="text-error text-sm mt-1">{errors.password.message}</span>}
//                         <label className="label">
//                             <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
//                         </label>
//                     </div>

//                     <div className="form-control mt-2">
//                         <button className="btn btn-primary w-full" type="submit">Login</button>
//                     </div>
//                 </form>

//                 <Link to="/register" className="text-purple-800 pb-6 font-medium underline text-center">
//                     Sign Up
//                 </Link>
//             </div>
//         </div>
//     )
// }

// export default Login
