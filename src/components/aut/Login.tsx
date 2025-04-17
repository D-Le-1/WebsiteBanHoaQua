import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { loginUser } from "../../useQuery/api/api"
import { LoginResponse } from "../../useQuery/user/auth"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const LoginPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginResponse>()

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      toast("Đăng nhập thành công", { position: "top-right" })
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/")
        }
        window.location.reload()
      }, 1000)
    },
    onError: (errors: any) => {
      toast("Sai tài khoản hoặc mật khẩu", { position: "top-right" })
    }
  })

  const onSubmit = (data: LoginResponse) => {
    mutation.mutate(data)
  }

  return (
    <div className="flex h-screen justify-center">
      {/* Hình ảnh bên trái */}
      <div className="hidden md:flex items-center">
        <img
          src="images/a1c7dc5b68a42239311e510f54d8cd59.jpg"
          alt="Shopping"
          className="w-[800px] h-[600px]"
        />
      </div>

      {/* Form đăng nhập bên phải */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <h2 className="text-3xl font-semibold mb-4">Log in to Exclusive</h2>
        <p className="text-gray-600 mb-6">Enter your details below</p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-center items-center"
        >
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
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}

          <input
            id="password"
            {...register("password", {
              require: "Password is required",
              minLength: {
                value: 5,
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
          <div className="flex justify-center space-x-40 w-full">
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
            >
              {mutation.isLoading ? "Logging in...." : "Login"}
            </button>
            <a href="#" className="text-red-500 hover:underline">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
