import { useToast } from "@/components/ui/use-toast";
import { AuthService } from "@/lib/services";
import { useAppSelector } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";

export function EmailVerificationBanner() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();


  if (!user || user.email_verified) return null;

  const resend = async () => {
    try {
      await AuthService.resendVerificationEmail(user.email);
      toast({
        title: "Verification Email Sent",
        description: "Check your inbox for the verification link.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.error || "Failed to resend verification email.",
        variant: "destructive",
      });
    }
  };

  return (
    !user.email_verified && (
      <div className="bg-yellow-100 border border-yellow-300 p-4 rounded-md text-yellow-900 flex justify-between items-center">
        <span>Your email is not verified.</span>
        <button
          onClick={resend}
          className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
        >
          Resend Verification Email
        </button>
      </div>
    )
  );
}
