import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function EventForm() {
  return (
    <div className=" p-4">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <ArrowLeftIcon className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Celebrate Birthday</h1>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center p-4 space-y-4 md:flex-row md:space-x-8 md:space-y-0">
        <form className="w-full max-w-md p-4 space-y-4 border rounded-md">
          <div className="space-y-2">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              placeholder="Value"
              defaultValue="Value"
              type="tel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <Input id="expiry-date" placeholder="Value" defaultValue="Value" />
          </div>
          <div className="flex justify-between pt-4">
            <Button variant={"breadcrumb"}>Delete</Button>
            <Button>Create event</Button>
          </div>
        </form>
        <aside className="w-full max-w-xs p-4 space-y-4 border rounded-md">
          <h2 className="text-lg font-semibold">Icon</h2>
          <div className="flex items-center space-x-2">
            <RadioGroup defaultValue="default">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="default" />
                <Label htmlFor="default">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload">Upload your own</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="w-full h-32 bg-gray-200 rounded-md" />
        </aside>
      </main>
    </div>
  );
}

function ArrowLeftIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}
