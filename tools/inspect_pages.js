const fs = require('fs');

async function inspectElements() {
  const pages = [
    { name: 'home', url: 'https://aestheticsbydrsamina.com/' },
    { name: 'about', url: 'https://aestheticsbydrsamina.com/about-us/' },
    { name: 'appointment', url: 'https://aestheticsbydrsamina.com/book-an-appointment/' },
    { name: 'hydrafacial', url: 'https://aestheticsbydrsamina.com/hydrafacial/' },
    { name: 'template', url: 'https://aestheticsbydrsamina.com/treatment-page-template/' },
    { name: 'elementor7', url: 'https://aestheticsbydrsamina.com/elementor-7/' },
    { name: 'helloworld', url: 'https://aestheticsbydrsamina.com/hello-world/' },
  ];

  for (const p of pages) {
    const res = await fetch(p.url);
    const html = await res.text();
    console.log(`\n=== Page: ${p.name} (${p.url}) ===`);
    
    // Check forms
    const forms = [...html.matchAll(/<form[\s\S]*?<\/form>/gi)];
    console.log(`Found ${forms.length} forms`);
    forms.forEach((f, idx) => {
      const action = f[0].match(/action=["']([^"']*)["']/i)?.[1] || 'no action';
      const method = f[0].match(/method=["']([^"']*)["']/i)?.[1] || 'no method';
      console.log(`  Form ${idx+1}: action="${action}", method="${method}"`);
    });

    // Check external scripts or widgets
    const scripts = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    const externalScripts = scripts.filter(s => !s.includes('aestheticsbydrsamina.com'));
    console.log(`External scripts (${externalScripts.length}):`, externalScripts);
  }
}

inspectElements().catch(console.error);
