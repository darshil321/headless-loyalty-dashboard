import LotaltyEventForm from "@/components/event/LotaltyEventForm";
import { Page } from "@shopify/polaris";

export default function NewEvent() {
  return (
    <Page>
      <LotaltyEventForm isUpdate={false} />;
    </Page>
  );
}
