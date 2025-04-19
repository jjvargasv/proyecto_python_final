import React from "react";
export default function TerminosCondiciones() {
  return (
    <section className="container mx-auto py-12 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Términos y Condiciones</h2>
      <div className="bg-white/10 rounded-lg shadow-lg p-8 text-white">
        <p>
          Al utilizar este sitio web, aceptas los siguientes términos y condiciones. Nos reservamos el derecho de modificar estos términos en cualquier momento.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>El uso de este sitio es bajo tu propio riesgo.</li>
          <li>Los precios y productos pueden cambiar sin previo aviso.</li>
          <li>No nos hacemos responsables por daños derivados del uso de la web.</li>
          <li>El contenido del sitio es solo para fines informativos.</li>
          <li>Respetamos la propiedad intelectual y derechos de autor.</li>
        </ul>
        <p className="mt-4">Si tienes preguntas, contáctanos.</p>
      </div>
    </section>
  );
}
