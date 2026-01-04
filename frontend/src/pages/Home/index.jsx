import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, TrendingUp, Code, DollarSign, Wallet, ArrowRight, Sparkles } from 'lucide-react';

// Particle Background
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.documentElement.scrollHeight, 3000);
    };
    resizeCanvas();

    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />;
};

const Home = () => {
  return (
    <div className="relative text-white overflow-hidden min-h-screen">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6" style={{ zIndex: 10 }}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-500/20 rounded-full border border-purple-400/30 text-sm font-semibold backdrop-blur-sm">
                <Sparkles size={16} className="text-purple-300" />
                Now supporting Solana & Ethereum
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-2">
                <span className="block text-white mb-3" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>
                  The Future of
                </span>
              </h1>
            </motion.div>

            {/* Gradient Text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-10"
            >
              <h2 
                className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight"
                style={{ 
                  WebkitTextStroke: '1px rgba(168, 85, 247, 0.3)',
                  textShadow: '0 0 80px rgba(168, 85, 247, 0.5)'
                }}
              >
                Web3 Payments
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto font-medium leading-relaxed"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}
            >
              Accept recurring crypto payments with zero hassle. Built for Web3 companies that need reliable, automated subscription billing.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-lg shadow-2xl overflow-hidden min-w-[240px]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2 text-white">
                  Start Building
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold text-lg border-2 border-white/30 transition-all text-white min-w-[240px]"
              >
                View Demo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
            >
              {[
                { value: '$2M+', label: 'Processed', gradient: 'from-purple-400 to-pink-400' },
                { value: '50+', label: 'Merchants', gradient: 'from-blue-400 to-cyan-400' },
                { value: '99.9%', label: 'Uptime', gradient: 'from-green-400 to-teal-400' },
                { value: '24/7', label: 'Support', gradient: 'from-orange-400 to-red-400' }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
                  <div className="relative bg-gray-900/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-300 font-semibold text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-7 h-12 border-2 border-white/50 rounded-full p-1.5">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-3 bg-white/70 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6" style={{ zIndex: 10 }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              Built for Scale
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Everything you need to manage subscriptions at Web3 speed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Sub-second transaction processing. Instant confirmations.', color: 'from-yellow-500 to-orange-500' },
              { icon: Shield, title: 'Secure', desc: 'Audited smart contracts. Your funds are always safe.', color: 'from-green-500 to-teal-500' },
              { icon: TrendingUp, title: 'Analytics', desc: 'Track MRR, churn, LTV and more in real-time.', color: 'from-blue-500 to-indigo-500' },
              { icon: Code, title: 'Developer First', desc: 'Clean APIs and comprehensive documentation.', color: 'from-purple-500 to-pink-500' },
              { icon: DollarSign, title: 'Multi-Currency', desc: 'Accept USDC, DAI, USDT, or any token.', color: 'from-red-500 to-pink-500' },
              { icon: Wallet, title: 'Multi-Chain', desc: 'Ethereum, Polygon, Solana support.', color: 'from-cyan-500 to-blue-500' }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity`} />
                  <div className="relative bg-gray-900/60 backdrop-blur-lg rounded-2xl p-8 border border-white/20 h-full">
                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-xl mb-6`}>
                      <Icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6" style={{ zIndex: 10 }}>
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-3xl opacity-40" />
              <div className="relative bg-gradient-to-r from-purple-900/80 via-pink-900/80 to-blue-900/80 backdrop-blur-sm rounded-3xl p-16 text-center border border-white/20">
                <h2 className="text-5xl font-bold mb-6 text-white">Ready to Build?</h2>
                <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                  Join 50+ Web3 companies automating their subscriptions.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white text-purple-900 rounded-xl font-bold text-lg shadow-2xl"
                >
                  Start Free Trial
                  <ArrowRight size={24} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;