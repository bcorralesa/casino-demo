// api/verify-age/index.ts

// Don't import from @azure/functions – we'll use `any` for simplicity
export default async function verifyAge(context: any, req: any): Promise<void> {
  try {
    const resp = await fetch(
      "https://reactid-api-management.azure-api.net/idv/idvpayload",
      {
        method: req.method, // POST
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": process.env["VITE_SUBS_KEY"]!,
        },
        body: JSON.stringify(req.body),
      }
    );
    const body = await resp.json();
    context.res = {
      status: resp.status,
      body,
    };
  } catch (err: any) {
    context.res = {
      status: 500,
      body: { error: err.message },
    };
  }
}
