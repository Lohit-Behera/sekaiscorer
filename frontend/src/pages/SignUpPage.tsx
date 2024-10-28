import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { fetchRegister } from "@/features/authSlice";
import { toast } from "sonner";

const signUpFormSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(20, {
        message: "Username must be less than 20 characters.",
      })
      .regex(/^[a-z0-9_]+$/, {
        message:
          "Username can only contain lowercase letters, numbers, and underscores.",
      })
      .toLowerCase()
      .trim(),
    fullName: z
      .string()
      .min(2, {
        message: "Full name must be at least 2 characters.",
      })
      .max(50, {
        message: "Full name must be less than 50 characters.",
      }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .max(50, {
        message: "Password must be less than 50 characters.",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
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
  const dispatch = useDispatch<AppDispatch>();

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
    const signUpPromise = dispatch(fetchRegister(data)).unwrap();
    toast.promise(signUpPromise, {
      loading: "Signing up...",
      success: (data: any) => {
        return `${data.message || "Signed up successfully!"}`;
      },
      error: (error: any) => {
        return (
          error || error.message || "Something went wrong while signing up"
        );
      },
    });
  };
  return (
    <Card className="mx-auto w-[350px] md:w-[450px]">
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
            className="space-y-4"
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
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Sign in
          </Link>
        </div>
        <div className="w-20 h-20 bg-muted"></div>
      </CardContent>
    </Card>
  );
}

export default SignUpPage;
