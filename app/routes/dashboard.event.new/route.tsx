import LoyaltyEventSignUpForm from "@/components/event/LoyaltyEventSignupForm";
import LoyaltyEventOrderCreateForm from "@/components/event/LoyaltyEventOrderCreateForm";
import { useAppSelector } from "@/store/hooks";
import { Page } from "@shopify/polaris";

export default function NewEvent() {
  const _eventType = useAppSelector((state) => state.event.selectedEvent);

  if (_eventType === "SIGN_UP") {
    return (
      <Page>
        <LoyaltyEventSignUpForm isUpdate={false} />
      </Page>
    );
  } else if (_eventType === "ORDER_CREATE") {
    return (
      <Page>
        <LoyaltyEventOrderCreateForm isUpdate={false} />{" "}
      </Page>
    );
  }
}
