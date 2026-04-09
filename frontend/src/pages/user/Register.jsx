// import { Link, useNavigate } from 'react-router-dom'
// import { useForm } from 'react-hook-form'
// import { useAuth } from '../context/AuthContext'
// import axiosInstance from '../api/axios'

// function Register() {
//     const { register, handleSubmit, watch, formState: { errors } } = useForm()
//     const { register: firebaseRegister } = useAuth()
//     const navigate = useNavigate()
//     const password = watch('password')

//     const onSubmit = async (data) => {
//         await firebaseRegister(data.email, data.password)
//         await axiosInstance.post('/users', { name: data.name, email: data.email, createdAt: new Date() })
//         navigate('/')
//     }

//     return (
//         <div className="flex justify-center items-center py-20 bg-base-200 min-h-[calc(100vh-64px)]">
//             <div className="card w-80 bg-base-100 border border-base-300">
//                 <div className="text-center pt-6">
//                     <h1 className="text-3xl font-bold">Register now!</h1>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="card-body">
//                     <div className="form-control">
//                         <label className="label"><span className="label-text">Full Name</span></label>
//                         <input
//                             type="text"
//                             placeholder="full name"
//                             className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
//                             {...register('name', {
//                                 required: 'Name is required',
//                                 minLength: { value: 2, message: 'Minimum 2 characters' }
//                             })}
//                         />
//                         {errors.name && <span className="text-error text-sm mt-1">{errors.name.message}</span>}
//                     </div>

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
//                     </div>

//                     <div className="form-control">
//                         <label className="label"><span className="label-text">Confirm Password</span></label>
//                         <input
//                             type="password"
//                             placeholder="confirm password"
//                             className={`input input-bordered ${errors.confirmPassword ? 'input-error' : ''}`}
//                             {...register('confirmPassword', {
//                                 required: 'Please confirm your password',
//                                 validate: (val) => val === password || 'Passwords do not match'
//                             })}
//                         />
//                         {errors.confirmPassword && <span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>}
//                     </div>

//                     <div className="form-control mt-2">
//                         <button className="btn btn-primary w-full" type="submit">Register</button>
//                     </div>
//                 </form>

//                 <Link to="/login" className="text-purple-800 pb-6 font-medium underline text-center">
//                     Already have an account? Login
//                 </Link>
//             </div>
//         </div>
//     )
// }

// export default Register
