import Link from "next/link"
import { CheckCircle, Mail, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ConfirmationComponent() {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Submission Successful</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your information has been submitted for approval
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Processing Time</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Please wait for a period of 48 hours for processing
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Email Confirmation</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  A confirmation message will be sent to your email address
                </p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Once approved, you can proceed to login with your credentials
            </p>

            <Button asChild className="w-full">
              <Link href="/">Back to Login</Link>
            </Button>
          </div>

          <div className="text-center">
            <Link href="/support" className="text-xs text-muted-foreground">Need help? Contact our support team</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
