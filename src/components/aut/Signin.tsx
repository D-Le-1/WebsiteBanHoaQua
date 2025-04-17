import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Signin from './../../pages/Signin';
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RegisterCredentials } from "../../useQuery/user/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { registerUser } from "../../useQuery/api/api";

const SigninPage = () => {
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterCredentials>();

    const mutation = useMutation({
      mutationFn: registerUser,
      onSuccess: (data) => {
        toast("Đăng ký thành công", {position: "top-right"});
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      },
      onError: (error: any) => {
        toast("Tài khoản đã tồn tại", {position: "top-right"})
      },
    });
    

    const onSubmit = (data: RegisterCredentials) => {
      mutation.mutate(data)
    }

    return (
      <div className="flex h-screen justify-center">
        <div className="hidden md:flex items-center">
          <img
            src="images/a1c7dc5b68a42239311e510f54d8cd59.jpg"
            alt="Shopping"
            className="w-[800px] h-[600px]"
          />
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <h2 className="text-3xl font-semibold mb-4">Create an account</h2>
        <p className="text-gray-600 mb-6">Enter your details below</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col justify-center items-center">
            <input
              id="name"
                {...register("name")}
              type="text"
              placeholder="Name"
              className="w-96 border-b-2 p-2 mb-4 outline-none focus:border-black"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
              </p>
            )}
            <input id="phone"
            {...register("phone")} 
            type="text" 
            placeholder="Phone" 
            className="w-96 border-b-2 p-2 mb-4 outline-none focus:border-black" />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
              </p>
            )}
            <input id="address"{...register("address")} type="text" placeholder="Address" className="w-96 border-b-2 p-2 mb-4 outline-none focus:border-black" />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
              </p>
            )}
          <input
            id="email"
            {...register("email", {
                require: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: "Invalid email address"
                }
              })}
            type="text"
            placeholder="Email or Phone Number"
            className="w-96 border-b-2 p-2 mb-4 outline-none focus:border-black"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
            </p>
          )}

          <input
            id="password"
            {...register("password", {
                require: "Password is required",
                minLength:{
                    value: 6,
                    message: "Password must be at least 6 characters"
                }
            })}
            type="password"
            placeholder="Password"
            className="w-96 border-b-2 p-2 mb-6 outline-none focus:border-black"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
            </p>
          )}
          <div className="flex flex-col justify-center space-x-40 w-96">
            <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600">
              {mutation.isLoading ? "Signup...": "Creating Account"}
            </button>
          </div>
          <Link className="flex text-black border px-6 py-2 rounded-md hover:bg-red-600 space-x-5 w-96 justify-center mt-5">
                <div className="relative pl-6">
                <FaGoogle className="absolute top-1 -left-0.5 content-center items-center" />
                <div className="content-center">Sign up with Google</div>
                </div>
            </Link>
            <div className="flex space-x-5 mt-5">
                <p className="text-base text-zinc-500">Already have account?</p>
                <Link to="/login" className="border-0 border-b-2 border-black">Log in</Link>
            </div>
        </form>
      </div>
      </div>
    );
  };
  
  export default SigninPage;