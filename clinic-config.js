/**
 * The Asthetik - Clinic Configuration
 * Single Source of Truth for clinic details, branches, services, and contacts.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CLINIC_CONFIG = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return {
    brandName: "The Asthetik",
    doctorName: "Dr. Samina Habib",
    tagline: "Aesthetics by Dr. Samina Habib",
    primaryDomain: "https://aestheticsbydrsamina.com",

    // Social Links
    social: {
      instagram: "https://www.instagram.com/aestheticsbydrsaminaclinic/",
      tiktok: "https://www.tiktok.com/@theasthetikclinic",
      facebook: "TODO_CONFIRM" // [CONFIRM] marked as placeholder per guidelines
    },

    // Services for booking flow dropdown
    services: [
      { id: "consultation", name: "Initial Skin Consultation with Dr. Samina Habib", durationMinutes: 30 },
      { id: "hydrafacial", name: "HydraFacial Treatment", durationMinutes: 60 },
      { id: "acne-scar-treatment", name: "Acne & Scar Treatment", durationMinutes: 45 },
      { id: "prp-hair-face", name: "PRP / GFC Hair & Skin Rejuvenation", durationMinutes: 45 },
      { id: "chemical-peel", name: "Medical Grade Chemical Peels", durationMinutes: 30 },
      { id: "laser-hair-removal", name: "Laser Hair Removal", durationMinutes: 45 },
      { id: "anti-aging-botox-fillers", name: "Anti-Aging, Botox & Dermal Fillers", durationMinutes: 45 },
      { id: "pigmentation-brightening", name: "Melasma & Pigmentation Treatment", durationMinutes: 45 },
      { id: "microneedling", name: "Microneedling / Dermapen Treatment", durationMinutes: 45 },
      { id: "general-dermatology", name: "General Dermatology Consultation", durationMinutes: 30 }
    ],

    // Branches
    branches: {
      "shah-faisal-colony": {
        id: "shah-faisal-colony",
        name: "Shah Faisal Colony",
        displayName: "Shah Faisal Colony Branch",
        fullName: "The Asthetik - Shah Faisal Colony",
        slug: "shah-faisal-colony",
        urlPath: "/shah-faisal-colony/",
        address: "Umar Farooq Road, near Happy Time School, Block 1, Shah Faisal Colony, Karachi 75230",
        addressLines: [
          "Umar Farooq Road, near Happy Time School",
          "Block 1, Shah Faisal Colony",
          "Karachi 75230, Pakistan"
        ],
        phones: [
          { display: "(021) 34570339", tel: "+922134570339" },
          { display: "0316 2222983", tel: "+923162222983" }
        ],
        primaryPhone: "(021) 34570339",
        primaryTel: "+922134570339",
        whatsapp: "https://wa.me/923162222983",
        whatsappNumber: "923162222983",
        whatsappDisplay: "+92 316 2222983",
        mapsLink: "https://maps.app.goo.gl/W8VjebuPW1TP7zAD9",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2888.948857330312!2d67.14427239999999!3d24.883191499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33985afb40e8f%3A0x62545eec7657d2c5!2sThe%20Asthetik!5e1!3m2!1sen!2s!4v1791607732758!5m2!1sen!2s",
        geo: {
          latitude: 24.8831915,
          longitude: 67.1442724
        },
        hours: {
          display: "Monday to Saturday: 12:00 PM – 07:00 PM (Sunday Closed)",
          short: "Mon - Sat: 12:00 PM - 7:00 PM",
          daysOpen: [1, 2, 3, 4, 5, 6], // 0 is Sunday, 1 is Monday...
          startHour: 12,
          startMinute: 0,
          endHour: 19,
          endMinute: 0,
          slotDurationMinutes: 30,
          closedDaysText: "Sunday Closed",
          schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          schemaOpens: "12:00",
          schemaCloses: "19:00"
        }
      },

      "dha": {
        id: "dha",
        name: "DHA Phase 6",
        displayName: "DHA Phase 6 Branch",
        fullName: "The Asthetik - DHA Phase 6",
        slug: "dha",
        urlPath: "/dha/",
        address: "Office 102, First Floor, Plot No. 54C, Lane 4, DHA Phase 6, Shahbaz Commercial Area, Defence Housing Authority, Karachi 75500",
        addressLines: [
          "Office 102, First Floor, Plot No. 54C, Lane 4",
          "DHA Phase 6, Shahbaz Commercial Area",
          "Defence Housing Authority, Karachi 75500, Pakistan"
        ],
        phones: [
          { display: "(021) 35240710", tel: "+922135240710" },
          { display: "0316 2222983", tel: "+923162222983" }
        ],
        primaryPhone: "(021) 35240710",
        primaryTel: "+922135240710",
        whatsapp: "https://wa.me/923162222983", // Same as Shah Faisal per requirements
        whatsappNumber: "923162222983",
        whatsappDisplay: "+92 316 2222983",
        mapsLink: "https://share.google/zRemav08VPzk6QftP", // [CONFIRM] Google Share link; replace with maps.app.goo.gl link if provided
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2891.033411294426!2d67.0485719!3d24.793908400000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33d78568aaa89%3A0xcc9d77bac3bfd36f!2sThe%20Aesthetic!5e1!3m2!1sen!2s!4v1791607596363!5m2!1sen!2s",
        geo: {
          latitude: 24.7939084,
          longitude: 67.0485719
        },
        hours: {
          display: "Monday to Saturday: 12:30 PM – 06:30 PM (Sunday Closed)",
          short: "Mon - Sat: 12:30 PM - 6:30 PM",
          daysOpen: [1, 2, 3, 4, 5, 6],
          startHour: 12,
          startMinute: 30,
          endHour: 18,
          endMinute: 30,
          slotDurationMinutes: 30,
          closedDaysText: "Sunday Closed",
          schemaDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          schemaOpens: "12:30",
          schemaCloses: "18:30"
        }
      }
    },

    // Helper functions
    getBranch: function (branchId) {
      return this.branches[branchId] || null;
    },

    getAllBranches: function () {
      return Object.values(this.branches);
    },

    formatWhatsAppMessage: function (booking) {
      var branch = this.getBranch(booking.branchId);
      var branchName = branch ? branch.name : (booking.branchName || "The Asthetik");
      var text = "Hello The Asthetik,\n" +
        "I would like to request an appointment:\n\n" +
        "• Patient Name: " + (booking.name || "") + "\n" +
        "• Phone: " + (booking.phone || "") + "\n" +
        "• Branch: " + branchName + "\n" +
        "• Service: " + (booking.serviceName || "") + "\n" +
        "• Date: " + (booking.dateFormatted || booking.date || "") + "\n" +
        "• Time Slot: " + (booking.timeSlot || "") + "\n";

      if (booking.notes && booking.notes.trim()) {
        text += "• Notes: " + booking.notes.trim() + "\n";
      }

      text += "\nPlease confirm my appointment availability. Thank you!";
      return text;
    },

    getWhatsAppUrl: function (booking) {
      var branch = this.getBranch(booking.branchId);
      var phoneNum = branch && branch.whatsappNumber ? branch.whatsappNumber : this.branches["shah-faisal-colony"].whatsappNumber;
      if (!phoneNum || phoneNum === "TODO_CONFIRM") {
        return null; // Return null so callers can handle fallback
      }
      var message = this.formatWhatsAppMessage(booking);
      return "https://wa.me/" + phoneNum + "?text=" + encodeURIComponent(message);
    }
  };
});
