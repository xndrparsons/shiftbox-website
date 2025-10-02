// apps/website/app/(site)/contact/actions.ts
'use server';

export async function submitContact(formData: FormData): Promise<void> {
  // TODO: implement (send email / store to DB). For now, no-op + basic logging.
  // You can safely modify this function without touching the page module.
  try {
    const name = formData.get('name')?.toString() ?? '';
    const email = formData.get('email')?.toString() ?? '';
    const message = formData.get('message')?.toString() ?? '';
    console.log('[contact] submitContact', { name, email, message });
  } catch (err) {
    console.error('[contact] submitContact failed', err);
  }
}
