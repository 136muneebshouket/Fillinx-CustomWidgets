import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DemoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Shadcn UI Components Demo</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Button Examples</CardTitle>
            <CardDescription>Various button styles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Button Sizes</CardTitle>
            <CardDescription>Different button sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card Component</CardTitle>
            <CardDescription>This is a card component</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Cards can contain any content and are useful for organizing information.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Action Button</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}