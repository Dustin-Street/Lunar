export default function LunarButton({ text, onclick = () => {} }) {
  return (
    <button
      className="p-3 block rounded-2xl border-3 justify-self-center border-blue-200 bg-blue-400 hover:text-white hover:border-amber-200 hover:shadow-lg transform hover:-translate-y-px my-8 mx-4"
      type="button"
      onClick={onclick}
    >
      {text}
    </button>
  );
}
