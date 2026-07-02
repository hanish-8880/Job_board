"use client";

import { useActionState } from "react";
import { Input, Textarea, labelClass, errorText } from "./ui/fields";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { saveCompany, type CompanyFormState } from "@/app/employer/company/actions";

const initialState: CompanyFormState = { errors: {} };

export default function CompanyForm({
  initialValues,
}: {
  initialValues?: { name: string; website: string; description: string };
}) {
  const [state, formAction, pending] = useActionState(saveCompany, initialState);

  return (
    <Card className="max-w-xl p-6">
      <form action={formAction} className="flex flex-col gap-5">
        <div>
          <label className={labelClass} htmlFor="name">
            Company name
          </label>
          <Input id="name" name="name" defaultValue={initialValues?.name} className="mt-1.5" />
          {state.errors.name && <p className={errorText}>{state.errors.name}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="website">
            Website (optional)
          </label>
          <Input
            id="website"
            name="website"
            defaultValue={initialValues?.website}
            className="mt-1.5"
            placeholder="https://example.com"
          />
          {state.errors.website && <p className={errorText}>{state.errors.website}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="description">
            Description (optional)
          </label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialValues?.description}
            rows={4}
            className="mt-1.5"
          />
        </div>

        {state.formError && <p className={errorText}>{state.formError}</p>}

        <Button type="submit" disabled={pending} className="self-start">
          {pending ? "Saving…" : "Save company"}
        </Button>
      </form>
    </Card>
  );
}
