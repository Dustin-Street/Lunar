export default function Footer() {
  return (
    <footer className="bg-gray-700 text-amber-100 py-4 mt-auto w-full border-t-2  border-blue-300 hidden md:block">
      <div className="container mx-auto text-center flex flex-col items-center">
        <a
          href="/app-policy"
          className="text-amber-100 hover:text-amber-200 text-sm"
        >
          Terms of use and privacy policy
        </a>
      </div>
    </footer>
  );
}
