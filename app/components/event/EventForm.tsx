import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocation } from "@remix-run/react";
import { redirect } from "react-router";
import { StepEnum } from "../dashboard/DashBoard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type SetEventStageFunc = (stage: any) => void;

export default function EventForm({
  setEventStage,
}: {
  setEventStage: SetEventStageFunc;
}) {
  const router = useLocation();
  const { id = false } = router.search;

  const [formData, setFormData] = useState({
    points: "",
    expiryDate: "",
    icon: "default",
    minOrderValue: null,
    maxOrderValue: null,
    spendingType: "FIX",
    spendingLimit: null,
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEventData(id);
    }
  }, [id]);

  const fetchEventData = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      const data = await response.json();
      setFormData(data);
      if (data.iconUrl) {
        setIconPreview(data.iconUrl);
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, icon: value }));
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = id ? `/api/events/${id}` : "/api/events";
    const method = id ? "PUT" : "POST";

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    if (iconFile) {
      formDataToSend.append("icon", iconFile);
    }

    try {
      // const response = await fetch(url, {
      //   method,
      //   body: formDataToSend,
      // });
      redirect("/events");
      setEventStage(StepEnum.LIST_TABLE_STAGE);

      // if (response.ok) {
      //   setEventStage(StepEnum.LIST_TABLE_STAGE);
      // } else {
      //   console.error("Error submitting form:", await response.text());
      // }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-4">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <ArrowLeftIcon className="h-6 w-6" onClick={() => redirect("/")} />
          <h1 className="text-xl font-semibold">
            {id ? "Edit Event" : "Create New Event"}
          </h1>
        </div>
      </header>
      <main className="flex flex-col items-center justify-start p-4 space-y-4 md:flex-row md:space-x-8 md:space-y-0">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-4 space-y-4 border rounded-md"
        >
          <div className="space-y-2">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              name="points"
              placeholder="Enter points"
              value={formData.points}
              onChange={handleInputChange}
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              placeholder="Enter expiry date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              type="date"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="gap-2">
              <Label htmlFor="minimum order value">minimum order value</Label>
              <Input
                type="tel"
                id="minimum-order-value"
                placeholder="Enter minimum order value"
              />
            </div>
            <div className="gap-2">
              <Label htmlFor="maximum order value">maximum order value</Label>
              <Input
                type="tel"
                value={formData}
                onChange={handleInputChange}
                id="maximum-order-value"
                placeholder="Enter maximum order value"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="Spending Type">Spending Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="spendingLimit">Spending Limit</Label>
              <Input
                type="'tel"
                placeholder="spending limit"
                id="spending-limit"
              />
            </div>
          </div>
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                /* Handle delete */
              }}
            >
              Delete
            </Button>
            <Button type="submit">
              {id ? "Update event" : "Create event"}
            </Button>
          </div>
        </form>
        <aside className="w-full max-w-xs p-4 space-y-4 border rounded-md">
          <h2 className="text-lg font-semibold">Icon</h2>
          <RadioGroup value={formData.icon} onValueChange={handleRadioChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upload" id="upload" />
              <Label htmlFor="upload">Upload your own</Label>
            </div>
          </RadioGroup>
          {formData.icon === "upload" && (
            <Input type="file" accept="image/*" onChange={handleIconUpload} />
          )}
          <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center">
            {iconPreview ? (
              <img
                src={iconPreview}
                alt="Icon preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <DefaultIcon className="w-16 h-16 text-gray-400" />
            )}
          </div>
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

function DefaultIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
