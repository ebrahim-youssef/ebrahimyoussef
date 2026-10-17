import { handleContact } from './contact.js';

function jsonNotFound() {
  return new Response(JSON.stringify({ ok: false }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function handleRequest(request, env) {
  const { pathname } = new URL(request.url);

  if (pathname === '/api/contact') {
    return handleContact(request, env);
  }
  if (pathname.startsWith('/api/')) {
    return jsonNotFound();
  }

  return env.ASSETS.fetch(request);
}

export default { fetch: handleRequest };
