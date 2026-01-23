const IsForbidden = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 className="text-[6rem] text-red-500 font-extrabold m-0 leading-none">
      403
    </h1>
    <h2 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl">
      Accès interdit
    </h2>
    <p className="max-w-md mt-2 text-base text-center text-gray-500 md:text-lg">
      Désolé, vous n&apos;avez pas la permission d&apos;accéder à cette page.
    </p>
    <a
      href="/"
      className="px-6 py-2 mt-6 font-medium text-white transition-colors duration-200 bg-blue-500 rounded hover:bg-blue-600"
    >
      Retour à l'accueil
    </a>
  </div>
);

export default IsForbidden;
