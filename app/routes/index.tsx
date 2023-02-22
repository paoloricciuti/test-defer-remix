import { defer } from "@remix-run/node"; // or cloudflare/deno
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getBlog() {
  await wait(2000);
  return "A cool blog post";
}

async function getComments() {
  await wait(4000);
  return ["Very cool", "Super", "Fantastic"];
}

async function getRecommended() {
  await wait(1000);
  return ["Another post", "Suh interesting"];
}

async function getFail() {
  await wait(8000);
  throw new Error("Dang!");
}

export const loader = async () => {
  const recommended = getRecommended();
  const comments = getComments();
  const fail = getFail();
  const blog = await getBlog();

  // So you can write this without awaiting the promise:
  return defer({
    blog,
    comments,
    recommended,
    fail,
  });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {data.blog}
      <hr />
      <Suspense fallback={<>Loading comments...</>}>
        <ul>
          <Await resolve={data.comments}>
            {(data) => data.map((el) => <li key={el}>{el}</li>)}
          </Await>
        </ul>
      </Suspense>
      <hr />
      <Suspense fallback={<>Loading recommended...</>}>
        <ul>
          <Await resolve={data.recommended}>
            {(data) => data.map((el) => <li key={el}>{el}</li>)}
          </Await>
        </ul>
      </Suspense>
      <hr />
      <Suspense fallback={<>Loading fail...</>}>
        <Await errorElement={<>Error</>} resolve={data.fail}>
          {(data) => <p>{data}</p>}
        </Await>
      </Suspense>
    </div>
  );
}
