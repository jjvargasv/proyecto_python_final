import React from "react";
export default function PoliticaPrivacidad() {
  return (
    <section className="container mx-auto py-12 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Política de Privacidad</h2>
      <div className="bg-white/10 rounded-lg shadow-lg p-8 text-white">
        <p>
          Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información personal en nuestro sitio web. Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Nunca compartimos tus datos con terceros salvo por requerimiento legal. Puedes solicitar la eliminación de tus datos en cualquier momento.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>No compartimos tu información personal con terceros.</li>
          <li>Solo usamos tus datos para procesar pedidos y mejorar nuestros servicios.</li>
          <li>Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento.</li>
          <li>Utilizamos medidas de seguridad estándar para proteger tu información.</li>
        </ul>
        <p className="mt-4">Al utilizar nuestro sitio, aceptas esta política.</p>
      </div>
    </section>
  );
}
