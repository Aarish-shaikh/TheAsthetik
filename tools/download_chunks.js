const fs = require('fs');
const path = require('path');

const elementorChunks = [
  '397f2d183c19202777d6.bundle.min.js',
  '570c05c5a283cfb6b223.bundle.min.js',
  'a67c1f3a78d208bc7e1b.bundle.min.js',
  '8b0db5058afeb74622f5.bundle.min.js',
  'b4336601ffdb6086d1b5.bundle.min.js',
  '12335f45aaa79d244f24.bundle.min.js',
  '0ea083b809812c0e3aa1.bundle.min.js',
  '18344b05d8d1ea0702bc.bundle.min.js',
  '2a177a3ef4785d3dfbc5.bundle.min.js',
  '86d44e46e43d0807e708.bundle.min.js',
  '6167d20b95b33386757b.bundle.min.js',
  '45609661e409413f1cef.bundle.min.js',
  'c9624cb6e5dc9de86abd.bundle.min.js',
  'a2401356d329f179475e.bundle.min.js',
  '294d40984397351fd0f5.bundle.min.js',
  'e98d0220ce8c38404e7e.bundle.min.js',
  '740d06d17cea5cebdb61.bundle.min.js',
  '03caa53373b56d3bab67.bundle.min.js',
  'cacdcbed391abf4b48b0.bundle.min.js',
  'a2e8e48d28c5544fb183.bundle.min.js',
  'd85ab872da118940910d.bundle.min.js',
  '53ffedef32043348b99b.bundle.min.js',
  '2a67d3cc630e11815acc.bundle.min.js'
];

const elementorProChunks = [
  'b9addbc842a50347c9ab.bundle.min.js',
  '909c41acbc73cb741e9d.bundle.min.js',
  'f4f64e46173f50701949.bundle.min.js',
  '0726b2d81686a5392236.bundle.min.js',
  '49130d6eecb5ebc8afbd.bundle.min.js',
  '8cccdda9737c272489fc.bundle.min.js',
  'c009d6fa482515df23f8.bundle.min.js',
  '8d26e5df1a1527329fde.bundle.min.js',
  '3620fca501cb18163600.bundle.min.js',
  '0e9e688751d29d07a8d3.bundle.min.js',
  '5033ed75928eff79cb95.bundle.min.js',
  '71055747203b48a65a24.bundle.min.js',
  '06be1c07b9901f53d709.bundle.min.js',
  'a287ccfe024bea61e651.bundle.min.js',
  '8521a0597c50611efdc6.bundle.min.js',
  'f7b15b2ca565b152bf98.bundle.min.js',
  '8b46f464e573feab5dd7.bundle.min.js',
  'aec59265318492b89cb5.bundle.min.js',
  '4cd5da34009c30cb5d70.bundle.min.js',
  '63d984f8c96d1e053bc0.bundle.min.js',
  'c0029640cbdb48199471.bundle.min.js',
  'd71d263bd937f0906192.bundle.min.js',
  '3be1ab725f562d10dd86.bundle.min.js',
  '16a93245d08246e5e540.bundle.min.js',
  'b7065999d77832a1b764.bundle.min.js',
  '54f2e75f6769dce707e2.bundle.min.js',
  '88a2d8ca449739e34f9f.bundle.min.js',
  '6ba1f1f2aa99210fa1cf.bundle.min.js',
  '480d117b95956d1f28a5.bundle.min.js',
  'd54826f355f9822b0ec0.bundle.min.js',
  '00f9132bbbd683277a27.bundle.min.js',
  'c32f5d5e404511d68720.bundle.min.js',
  '89cc81d2188312a17a17.bundle.min.js',
  'cd9a95b2e4dd2a239b81.bundle.min.js',
  '2090b5f4906bcda1dcc2.bundle.min.js',
  '82093824ddb3f5531ab4.bundle.min.js',
  '480e081cebe071d683e8.bundle.min.js',
  'f0362773c21105d2c65c.bundle.min.js',
  'db797a097fdc5532ef4a.bundle.min.js',
  'a32526f3e4a201b5fce1.bundle.min.js',
  '137463f629e2b7cbaf02.bundle.min.js',
  '99a987d66bcc2ade0ee6.bundle.min.js',
  '16cf733dc3d3b250fef4.bundle.min.js',
  '75c36e8b0bacbac6105e.bundle.min.js',
  'cdf99fd0b063a0032d53.bundle.min.js',
  '5d88e65c03029f91931d.bundle.min.js'
];

async function downloadChunks() {
  const dir1 = path.join(__dirname, 'wp-content/plugins/elementor/assets/js');
  fs.mkdirSync(dir1, { recursive: true });
  for (const c of elementorChunks) {
    const file = path.join(dir1, c);
    if (!fs.existsSync(file)) {
      const u = `https://aestheticsbydrsamina.com/wp-content/plugins/elementor/assets/js/${c}`;
      try {
        const res = await fetch(u);
        if (res.ok) {
          fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
          console.log(`Saved Elementor chunk: ${c}`);
        } else {
          console.log(`Status ${res.status} for ${c}`);
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  const dir2 = path.join(__dirname, 'wp-content/plugins/elementor-pro/assets/js');
  fs.mkdirSync(dir2, { recursive: true });
  for (const c of elementorProChunks) {
    const file = path.join(dir2, c);
    if (!fs.existsSync(file)) {
      const u = `https://aestheticsbydrsamina.com/wp-content/plugins/elementor-pro/assets/js/${c}`;
      try {
        const res = await fetch(u);
        if (res.ok) {
          fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
          console.log(`Saved Elementor Pro chunk: ${c}`);
        } else {
          console.log(`Status ${res.status} for ${c}`);
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  }
}

downloadChunks().catch(console.error);
