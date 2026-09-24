const TOKEN = 'g1m4oXZF3NRQ5CFTYOuncv2mpGOkaQBkI-yvYzEH4WM';

export async function GET() {
  return new Response(`google-site-verification: google${TOKEN}.html`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}