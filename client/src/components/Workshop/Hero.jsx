import { hero } from "../../constants/data";


const WorkShopHero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white ">
      <img
        src={hero.image}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="absolute bottom-20 z-10 max-w-3xl  ">
        <h1 className="text-5xl">{hero.title}</h1>
        {/* <p className="text-xl mt-4">{hero.tagline}</p> */}
        <p className="mt-2 text-white/70">
          {hero.subline}
        </p>

        <button className="mt-6 px-8 py-3 bg-white text-black rounded-full">
          {hero.cta}
        </button>
      </div>
    </section>

    // <section className="grid md:grid-cols-2 gap-16 items-center py-32">
    //   <img src={hero.image} className="rounded-3xl shadow-xl" />

    //   <div>
    //     <h2 className="text-4xl font-semibold">
    //       Master the Viola Beauty Finish
    //     </h2>

    //     <p className="mt-6 text-gray-600">
    //       Inside this guided series, Vincentia shares the layering techniques
    //       and artistry behind the Viola Beauty signature glam.
    //     </p>

    //     <button className="mt-8 px-8 py-3 bg-black text-white rounded-full">
    //       Explore
    //     </button>
    //   </div>
    // </section>
  );
};

export default WorkShopHero;
