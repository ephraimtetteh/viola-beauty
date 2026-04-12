import React from 'react'
import { rateImages } from '../../constants/data';
import BrideSection from './BrideSection';
import RateCard from './BridalRates';

const HalfDayFullDay = () => {
  return (
    <div>
      <BrideSection
        title="The HalfDayFullDay Bride"
        image={rateImages[7]}
        description="Viola's full day experience is a full on luxury service where you have our head artist
        on site for a preferred number of hours starting from 6 hours. This is a curated
        service for clients who have cramped the various matrimonial ceremonies into one
        day or those who generally need an artist on standby for tweaks and freshening up
        of makeup as they transition from one part of the day to another."
        features={[
          "Same day makeup for both trad and white wedding/any and reception. ",
          "Change of eye and lip makeup.(max of 2 looks)",
          "Enhancement and freshening of skin.",
          "Artist stays for 6 hours.",
          "Complimentary makeup for MOB.",
        ]}
      />

      <div>
        <RateCard
          title="Book any of these packages and get a 10% discount in addition to package perks."
          packages={[
            {
              name: "6hrs",
              price: "GHS 7,000",
              features: [
                "Same day makeup for both trad and white wedding/any and reception. ",
                "Change of eye and lips.(max of 2 looks)",
                "Enhancement and freshening of skin.",
                "Artist stays for 6 hours.",
                "Artist closes off her day and cannot work on other bookings for the day.",
                "Complimentary makeup for MOB.",
              ],
            },
            {
              name: "8hrs",
              price: "GHS 9,000",
              features: [
                "Same day makeup for both trad and white wedding/any and reception. ",
                "Change of eye and lip makeup.(max of 3 looks)",
                "Enhancement and freshening of skin.",
                "Artist stays for chosen number of hours starting from 6 hours.",
                "Artist closes off her day and cannot work on other bookings for the day.",
                "Complimentary makeup for MOB.",
              ],
            },
            {
              name: "10hrs",
              price: "GHS 10,000",
              features: [
                "Same day makeup for both trad and white wedding/any and reception. ",
                "Change of eye and lips.(max of 3 looks)",
                "Enhancement and freshening of skin.",
                "Artist stays for 10 hours.",
                "Artist closes off her day and cannot work on other bookings for the day.",
                "Complimentary makeup for MOB.",
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}

export default HalfDayFullDay