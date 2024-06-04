export default function Unauthorized() {
  return (
    <main>
      <div className="container flex justify-center items-center mt-10 box-white !py-10">
        <h1 className="text-4xl pe-5">Not so fast...</h1>{' '}
        <span>You need to be signed in to access this page</span>
      </div>
    </main>
  );
}
