import React from "react";
export default function PreguntasFrecuentes() {
  return (
    <section className="container mx-auto py-12 px-4 min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-6">Preguntas Frecuentes</h2>
      <div className="bg-white/10 rounded-lg shadow-lg p-8 text-white flex flex-col gap-6">
        <div>
          <h3 className="font-bold text-lg mb-2">¿Qué productos ofrecen?</h3>
          <p>Ofrecemos productos personalizados de sublimación como tazas, camisetas, termos, cojines, llaveros y más.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">¿Cómo hago un pedido personalizado?</h3>
          <p>Puedes contactarnos por WhatsApp o correo electrónico para cotizar y enviar tu diseño. También puedes usar el formulario de contacto en la web.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">¿Cuánto tarda la entrega?</h3>
          <p>El tiempo de entrega depende del producto y la cantidad, pero normalmente de 3 a 7 días hábiles en Bogotá y hasta 10 días en otras ciudades.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">¿Qué métodos de pago aceptan?</h3>
          <p>Aceptamos transferencias bancarias, pagos por Nequi, Daviplata y efectivo en Bogotá.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">¿Puedo recoger mi pedido?</h3>
          <p>Sí, puedes recoger tu pedido en nuestro taller en Bogotá coordinando previamente por WhatsApp.</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">¿Ofrecen envíos nacionales?</h3>
          <p>Sí, realizamos envíos a todo Colombia con empresas de mensajería confiables.</p>
        </div>
      </div>
    </section>
  );
}
