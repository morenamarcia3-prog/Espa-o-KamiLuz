
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onNewBooking: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onNewBooking }) => {
  return (
    <div className="flex flex-col items-center py-10 md:py-20 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        <div className="text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-rose-500 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
            Unhas de Fibra & Gel
          </div>
          
          <div className="space-y-4">
            <h2 className="text-6xl md:text-8xl font-bold text-gray-800 leading-[0.9] brand-font">
              Suas unhas,<br />
              <span className="text-[#D14D72]">perfeitas</span>
            </h2>
          </div>

          <p className="text-lg text-stone-500 max-w-lg leading-relaxed">
            No Espaço KamiLuz, transformamos suas unhas em verdadeiras obras de arte. 
            Especialistas em alongamento de fibra e gel com técnicas modernas e produtos de alta qualidade.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onNewBooking}
              className="px-8 py-4 bg-[#D14D72] text-white rounded-2xl font-bold text-lg hover:bg-[#b03d5d] transition-all shadow-xl shadow-rose-100 flex items-center justify-center gap-2 group"
            >
              Agendar Agora
              <i className="fas fa-arrow-right text-sm transition-transform group-hover:translate-x-1"></i>
            </button>
            <button className="px-8 py-4 bg-white text-stone-600 border border-rose-100 rounded-2xl font-bold text-lg hover:bg-rose-50 transition-all flex items-center justify-center">
              Ver Serviços
            </button>
          </div>
          
          <div className="pt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
              <i className="far fa-clock text-[#D14D72]"></i>
              Agendamento Online
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
              <i className="fas fa-medal text-[#D14D72]"></i>
              Profissional Certificada
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
              <i className="far fa-heart text-[#D14D72]"></i>
              Atendimento Exclusivo
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-10 bg-[#D14D72]/5 rounded-[3rem] blur-3xl -z-10"></div>
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3]">
             <img 
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1287&auto=format&fit=crop" 
              className="w-full h-full object-cover" 
              alt="Beautiful Manicure Espaço KamiLuz" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          
          {/* Experience Badge */}
          <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-xl border border-rose-50 flex items-center gap-4 animate-bounce-slow">
            <div className="w-12 h-12 bg-rose-50 text-[#D14D72] rounded-2xl flex items-center justify-center text-xl">
              <i className="fas fa-award"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 leading-none">5+</p>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Anos de experiência</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Features */}
      <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <FeatureCard 
          icon="fa-calendar-check" 
          title="Flexibilidade" 
          desc="Escolha o melhor horário para você com nossa agenda em tempo real." 
        />
        <FeatureCard 
          icon="fa-gem" 
          title="Alta Performance" 
          desc="Materiais de primeira linha para unhas resistentes e com brilho intenso." 
        />
        <FeatureCard 
          icon="fa-magic" 
          title="Personalização" 
          desc="Nails designers prontas para realizar o design dos seus sonhos." 
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-md transition-all">
    <div className="w-14 h-14 bg-rose-50 text-[#D14D72] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
      <i className={`fas ${icon}`}></i>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-stone-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default LandingPage;
