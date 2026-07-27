import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const articles = [
  {
    id: 1,
    category: 'Heart Health',
    tag: 'Cardiology',
    title: '10 Early Warning Signs of Heart Disease You Shouldn\'t Ignore',
    excerpt: 'Learn to recognize the subtle symptoms that could indicate cardiovascular issues before they become serious conditions.',
    readTime: '5 min read',
    date: 'Jul 18, 2026',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
    color: '#ef4444',
  },
  {
    id: 2,
    category: 'Mental Wellness',
    tag: 'Psychology',
    title: 'The Science of Sleep: How 7 Hours Changes Everything',
    excerpt: 'Research shows that consistent quality sleep dramatically reduces risks of chronic disease, improves cognition, and boosts immunity.',
    readTime: '4 min read',
    date: 'Jul 14, 2026',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80',
    gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    color: '#7c3aed',
  },
  {
    id: 3,
    category: 'Nutrition',
    tag: 'Diet & Wellness',
    title: 'Anti-Inflammatory Foods That Actually Work, According to Doctors',
    excerpt: 'Nutritionists and physicians share their top evidence-based dietary choices to fight inflammation and promote long-term health.',
    readTime: '6 min read',
    date: 'Jul 10, 2026',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    gradient: 'linear-gradient(135deg, #059669, #06b6d4)',
    color: '#059669',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.4, 0, 0.2, 1] },
  }),
};

const BlogCard = ({ article, index }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.article
      ref={ref}
      className="blog-card glass-card"
      variants={cardVariants}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      custom={index}
      whileHover={{ y: -6 }}
    >
      {/* Image */}
      <div className="blog-img-wrap">
        <motion.img
          src={article.image}
          alt={article.title}
          className="blog-img"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.4 }}
        />
        <div className="blog-tag" style={{ background: article.gradient }}>
          <Tag size={10} />
          {article.tag}
        </div>
      </div>

      {/* Content */}
      <div className="blog-content">
        <div className="blog-meta">
          <span
            className="blog-category"
            style={{ color: article.color, background: `${article.color}18` }}
          >
            {article.category}
          </span>
          <div className="blog-read-info">
            <Clock size={12} />
            {article.readTime}
          </div>
        </div>

        <h3 className="blog-title">{article.title}</h3>
        <p className="blog-excerpt">{article.excerpt}</p>

        <div className="blog-footer">
          <span className="blog-date">{article.date}</span>
          <motion.a
            href="#"
            className="blog-read-more"
            style={{ color: article.color }}
            whileHover={{ x: 4 }}
          >
            Read More <ArrowRight size={13} />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
};

const HealthBlogSection = () => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const navigate = useNavigate();

  return (
    <section className="blog-section section-padding" id="health-tips" ref={ref}>
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-blue">Health Insights</span>
          <h2 className="section-title">
            Latest from Our{' '}
            <span className="text-gradient">Health Blog</span>
          </h2>
          <p>Expert-written articles to help you make informed decisions about your health and wellbeing.</p>
        </motion.div>

        {/* Articles grid */}
        <div className="blog-grid">
          {articles.map((article, i) => (
            <BlogCard key={article.id} article={article} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          style={{ textAlign: 'center', marginTop: '3rem' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => navigate('/about')}
            className="btn btn-outline"
            style={{ padding: '0.8rem 2rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View All Articles <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HealthBlogSection;
