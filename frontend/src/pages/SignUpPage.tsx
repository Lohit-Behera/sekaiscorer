import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CustomPassword from "@/components/CustomPassword";

const signUpFormSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    fullName: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    avatar: z
      .any()
      .refine((file) => file instanceof File, {
        message: "Avatar is required.",
      })
      .refine((file) => file?.size <= 3 * 1024 * 1024, {
        message: "Avatar size must be less than 3MB.",
      })
      .refine(
        (file) => ["image/jpeg", "image/png", "image/gif"].includes(file?.type),
        {
          message: "Only .jpg, .png, and .gif formats are supported.",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });


function SignUpPage() {
    const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
          username: "",
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          avatar: undefined,
        },
      });

    const onSubmit = (data: z.infer<typeof signUpFormSchema>) => {
        console.log(data);
    };
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your credentials to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
      <Form {...signUpForm}>
                <form
                  onSubmit={signUpForm.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <CustomPassword
                            placeholder="Password"
                            {...field}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <CustomPassword
                            placeholder="Confirm Password"
                            {...field}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0] || null)
                            }
                            placeholder="Avatar"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/login" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default SignUpPage