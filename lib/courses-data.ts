export interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  free: boolean
  content?: string
  videoUrl?: string
  imageUrl?: string
}

export interface Chapter {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: string
  institution: string
  level: string
  category: string
  rating: number
  reviewCount: number
  students: number
  price: number
  currency: string
  duration: number
  chapters: Chapter[]
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of computer science from Harvard University. Explore algorithms, data structures, and problem-solving techniques. This comprehensive course covers everything from basic programming concepts to advanced problem-solving strategies.',
    thumbnail: '/hero-learning.png',
    instructor: 'Prof. David Malan',
    institution: 'Harvard University',
    level: 'Beginner',
    category: 'Computer Science',
    rating: 4.8,
    reviewCount: 12453,
    students: 150000,
    price: 49,
    currency: 'USD',
    duration: 40,
    chapters: [
      {
        id: 'ch1',
        title: 'Getting Started',
        description: 'Introduction to programming concepts and your first program',
        lessons: [
          {
            id: 'l1',
            title: 'What is Computer Science?',
            description: 'Overview of CS and why it matters',
            duration: 15,
            free: true,
            content: 'Computer Science is the study of computation itself. It\'s about problem-solving, algorithms, and data structures.',
            videoUrl: 'https://example.com/video1.mp4',
            imageUrl: '/lesson-cs.png'
          },
          {
            id: 'l2',
            title: 'Your First Program',
            description: 'Write your first program in Python',
            duration: 20,
            free: true,
            content: 'Learn how to set up your environment and write your first "Hello World" program in Python.',
            videoUrl: 'https://example.com/video2.mp4',
            imageUrl: '/lesson-python.png'
          },
          {
            id: 'l3',
            title: 'Variables and Types',
            description: 'Understanding data types and variables',
            duration: 18,
            free: false,
            content: 'Deep dive into Python data types: integers, floats, strings, and booleans. Learn how to create and use variables.',
            videoUrl: 'https://example.com/video3.mp4',
            imageUrl: '/lesson-variables.png'
          },
          {
            id: 'l4',
            title: 'Functions and Scope',
            description: 'Creating reusable code with functions',
            duration: 22,
            free: false,
            content: 'Master function definition, parameters, return values, and variable scope in Python.',
            videoUrl: 'https://example.com/video4.mp4',
            imageUrl: '/lesson-functions.png'
          },
          {
            id: 'l5',
            title: 'Debugging Techniques',
            description: 'Find and fix errors in your code',
            duration: 16,
            free: false,
            content: 'Learn essential debugging techniques using print statements, debuggers, and error interpretation.',
            videoUrl: 'https://example.com/video5.mp4',
            imageUrl: '/lesson-debug.png'
          }
        ]
      },
      {
        id: 'ch2',
        title: 'Control Flow',
        description: 'Learn conditionals, loops, and decision-making',
        lessons: [
          {
            id: 'l6',
            title: 'If Statements',
            description: 'Making decisions in code',
            duration: 20,
            free: false,
            content: 'Understand boolean logic and if/elif/else statements for conditional execution.',
            videoUrl: 'https://example.com/video6.mp4',
            imageUrl: '/lesson-if.png'
          },
          {
            id: 'l7',
            title: 'Loops and Iteration',
            description: 'Repeating code with for and while loops',
            duration: 25,
            free: false,
            content: 'Master for loops, while loops, and loop control with break and continue statements.',
            videoUrl: 'https://example.com/video7.mp4',
            imageUrl: '/lesson-loops.png'
          },
          {
            id: 'l8',
            title: 'List Comprehensions',
            description: 'Advanced list creation techniques',
            duration: 18,
            free: false,
            content: 'Learn elegant ways to create and manipulate lists using comprehensions.',
            videoUrl: 'https://example.com/video8.mp4',
            imageUrl: '/lesson-comprehension.png'
          }
        ]
      },
      {
        id: 'ch3',
        title: 'Data Structures',
        description: 'Explore lists, dictionaries, and sets',
        lessons: [
          {
            id: 'l9',
            title: 'Lists and Tuples',
            description: 'Sequential data structures',
            duration: 22,
            free: false,
            content: 'Understand mutable lists and immutable tuples, and when to use each.',
            videoUrl: 'https://example.com/video9.mp4',
            imageUrl: '/lesson-lists.png'
          },
          {
            id: 'l10',
            title: 'Dictionaries and Sets',
            description: 'Key-value and unique collections',
            duration: 20,
            free: false,
            content: 'Work with dictionaries for key-value pairs and sets for unique collections.',
            videoUrl: 'https://example.com/video10.mp4',
            imageUrl: '/lesson-dicts.png'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Web Development Fundamentals',
    description: 'Master the foundations of web development with HTML, CSS, and JavaScript. Build responsive websites from scratch.',
    thumbnail: '/hero-learning.png',
    instructor: 'Prof. Rob Pike',
    institution: 'MIT',
    level: 'Beginner',
    category: 'Web Development',
    rating: 4.9,
    reviewCount: 18920,
    students: 200000,
    price: 59,
    currency: 'USD',
    duration: 50,
    chapters: [
      {
        id: 'ch1',
        title: 'HTML Basics',
        description: 'Learn the structure of web pages',
        lessons: [
          { id: 'l1', title: 'HTML Introduction', description: 'Getting started with HTML', duration: 15, free: true, content: 'Learn what HTML is and why it\'s important for web development.', videoUrl: 'https://example.com/v1.mp4', imageUrl: '/html-intro.png' },
          { id: 'l2', title: 'HTML Elements', description: 'Common HTML tags and elements', duration: 20, free: true, content: 'Explore essential HTML elements like headings, paragraphs, links, and images.', videoUrl: 'https://example.com/v2.mp4', imageUrl: '/html-elements.png' },
          { id: 'l3', title: 'Forms and Inputs', description: 'Creating interactive forms', duration: 18, free: false, content: 'Learn how to create forms with various input types and validation.', videoUrl: 'https://example.com/v3.mp4', imageUrl: '/html-forms.png' },
          { id: 'l4', title: 'Semantic HTML', description: 'Writing accessible HTML', duration: 16, free: false, content: 'Understand semantic HTML for better accessibility and SEO.', videoUrl: 'https://example.com/v4.mp4', imageUrl: '/html-semantic.png' }
        ]
      },
      {
        id: 'ch2',
        title: 'CSS Styling',
        description: 'Make your websites beautiful with CSS',
        lessons: [
          { id: 'l5', title: 'CSS Selectors', description: 'Selecting elements to style', duration: 17, free: false, content: 'Master CSS selectors: element, class, ID, and attribute selectors.', videoUrl: 'https://example.com/v5.mp4', imageUrl: '/css-selectors.png' },
          { id: 'l6', title: 'Box Model', description: 'Understanding spacing and sizing', duration: 19, free: false, content: 'Learn margin, padding, border, and content box concepts.', videoUrl: 'https://example.com/v6.mp4', imageUrl: '/css-box.png' },
          { id: 'l7', title: 'Flexbox Layout', description: 'Modern CSS layout technique', duration: 22, free: false, content: 'Create responsive layouts using CSS Flexbox.', videoUrl: 'https://example.com/v7.mp4', imageUrl: '/css-flex.png' },
          { id: 'l8', title: 'Grid Layout', description: 'Advanced layout with CSS Grid', duration: 21, free: false, content: 'Master CSS Grid for complex multi-dimensional layouts.', videoUrl: 'https://example.com/v8.mp4', imageUrl: '/css-grid.png' }
        ]
      },
      {
        id: 'ch3',
        title: 'JavaScript Essentials',
        description: 'Add interactivity with JavaScript',
        lessons: [
          { id: 'l9', title: 'JavaScript Basics', description: 'Variables, operators, and types', duration: 20, free: false, content: 'Learn JavaScript fundamentals and how to interact with the DOM.', videoUrl: 'https://example.com/v9.mp4', imageUrl: '/js-basics.png' },
          { id: 'l10', title: 'Events and Handlers', description: 'Responding to user actions', duration: 18, free: false, content: 'Handle user interactions like clicks, form submissions, and keyboard input.', videoUrl: 'https://example.com/v10.mp4', imageUrl: '/js-events.png' }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning with Python. Perfect for aspiring data scientists.',
    thumbnail: '/hero-learning.png',
    instructor: 'Dr. Rachel Carson',
    institution: 'Stanford University',
    level: 'Intermediate',
    category: 'Data Science',
    rating: 4.7,
    reviewCount: 9876,
    students: 85000,
    price: 79,
    currency: 'USD',
    duration: 60,
    chapters: [
      {
        id: 'ch1',
        title: 'Python for Data',
        description: 'Python libraries for data science',
        lessons: [
          { id: 'l1', title: 'NumPy Fundamentals', description: 'Working with numerical arrays', duration: 20, free: true, content: 'Learn NumPy for efficient numerical computing with arrays.', videoUrl: 'https://example.com/v1.mp4', imageUrl: '/numpy.png' },
          { id: 'l2', title: 'Pandas DataFrames', description: 'Data manipulation with Pandas', duration: 22, free: true, content: 'Master Pandas DataFrames for data cleaning and exploration.', videoUrl: 'https://example.com/v2.mp4', imageUrl: '/pandas.png' },
          { id: 'l3', title: 'Data Cleaning', description: 'Preparing data for analysis', duration: 25, free: false, content: 'Learn techniques for handling missing values and data normalization.', videoUrl: 'https://example.com/v3.mp4', imageUrl: '/cleaning.png' }
        ]
      },
      {
        id: 'ch2',
        title: 'Data Visualization',
        description: 'Creating insightful visualizations',
        lessons: [
          { id: 'l4', title: 'Matplotlib Basics', description: 'Creating plots and charts', duration: 18, free: false, content: 'Learn Matplotlib for creating various types of visualizations.', videoUrl: 'https://example.com/v4.mp4', imageUrl: '/matplotlib.png' },
          { id: 'l5', title: 'Seaborn Visualization', description: 'Statistical visualization', duration: 20, free: false, content: 'Create beautiful statistical graphics with Seaborn.', videoUrl: 'https://example.com/v5.mp4', imageUrl: '/seaborn.png' }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
    thumbnail: '/hero-learning.png',
    instructor: 'Prof. Andrew Ng',
    institution: 'Coursera/Stanford',
    level: 'Intermediate',
    category: 'Machine Learning',
    rating: 4.9,
    reviewCount: 25000,
    students: 300000,
    price: 99,
    currency: 'USD',
    duration: 80,
    chapters: [
      {
        id: 'ch1',
        title: 'ML Fundamentals',
        description: 'Core concepts in machine learning',
        lessons: [
          { id: 'l1', title: 'What is ML?', description: 'Introduction to machine learning', duration: 16, free: true, content: 'Understand supervised learning, unsupervised learning, and reinforcement learning.', videoUrl: 'https://example.com/v1.mp4', imageUrl: '/ml-intro.png' },
          { id: 'l2', title: 'Linear Regression', description: 'Predicting continuous values', duration: 24, free: true, content: 'Learn the fundamentals of linear regression and cost functions.', videoUrl: 'https://example.com/v2.mp4', imageUrl: '/linear-reg.png' },
          { id: 'l3', title: 'Logistic Regression', description: 'Classification problems', duration: 22, free: false, content: 'Understand classification using logistic regression.', videoUrl: 'https://example.com/v3.mp4', imageUrl: '/logistic-reg.png' }
        ]
      },
      {
        id: 'ch2',
        title: 'Advanced Algorithms',
        description: 'More sophisticated ML algorithms',
        lessons: [
          { id: 'l4', title: 'Decision Trees', description: 'Tree-based learning', duration: 20, free: false, content: 'Learn how decision trees work and when to use them.', videoUrl: 'https://example.com/v4.mp4', imageUrl: '/dt.png' },
          { id: 'l5', title: 'Neural Networks', description: 'Deep learning basics', duration: 28, free: false, content: 'Introduction to neural networks and how they learn.', videoUrl: 'https://example.com/v5.mp4', imageUrl: '/nn.png' }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Business Strategy Essentials',
    description: 'Learn business strategy, management, and entrepreneurship from industry leaders.',
    thumbnail: '/hero-learning.png',
    instructor: 'Dr. Michael Porter',
    institution: 'Harvard Business School',
    level: 'Intermediate',
    category: 'Business',
    rating: 4.6,
    reviewCount: 5432,
    students: 45000,
    price: 69,
    currency: 'USD',
    duration: 45,
    chapters: [
      {
        id: 'ch1',
        title: 'Strategy Fundamentals',
        description: 'Core strategy concepts',
        lessons: [
          { id: 'l1', title: 'What is Strategy?', description: 'Understanding strategic thinking', duration: 18, free: true, content: 'Learn what strategy means and why it matters for organizations.', videoUrl: 'https://example.com/v1.mp4', imageUrl: '/strategy.png' },
          { id: 'l2', title: 'Competitive Analysis', description: 'Understanding the market', duration: 22, free: true, content: 'Learn Porter\'s Five Forces and competitive advantage.', videoUrl: 'https://example.com/v2.mp4', imageUrl: '/competitive.png' },
          { id: 'l3', title: 'Business Models', description: 'Creating value', duration: 20, free: false, content: 'Explore different business models and value propositions.', videoUrl: 'https://example.com/v3.mp4', imageUrl: '/models.png' }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Digital Marketing Mastery',
    description: 'Master digital marketing, SEO, social media, and content strategy.',
    thumbnail: '/hero-learning.png',
    instructor: 'Neil Patel',
    institution: 'Digital Marketing Institute',
    level: 'Beginner',
    category: 'Marketing',
    rating: 4.5,
    reviewCount: 7654,
    students: 120000,
    price: 49,
    currency: 'USD',
    duration: 35,
    chapters: [
      {
        id: 'ch1',
        title: 'Digital Marketing Basics',
        description: 'Foundation of digital marketing',
        lessons: [
          { id: 'l1', title: 'Marketing Fundamentals', description: 'Overview of digital marketing', duration: 16, free: true, content: 'Learn the basics of digital marketing and its channels.', videoUrl: 'https://example.com/v1.mp4', imageUrl: '/digi-marketing.png' },
          { id: 'l2', title: 'SEO Essentials', description: 'Search engine optimization', duration: 20, free: true, content: 'Master on-page and off-page SEO techniques.', videoUrl: 'https://example.com/v2.mp4', imageUrl: '/seo.png' },
          { id: 'l3', title: 'Content Strategy', description: 'Creating valuable content', duration: 18, free: false, content: 'Learn how to create and distribute valuable content.', videoUrl: 'https://example.com/v3.mp4', imageUrl: '/content.png' }
        ]
      }
    ]
  },
  {
    id: '7',
    title: 'Cloud Computing with AWS',
    description: 'Learn to build scalable applications on Amazon Web Services.',
    thumbnail: '/hero-learning.png',
    instructor: 'Prof. Aidan Finn',
    institution: 'AWS Training Partners',
    level: 'Intermediate',
    category: 'Cloud Computing',
    rating: 4.7,
    reviewCount: 8765,
    students: 95000,
    price: 89,
    currency: 'USD',
    duration: 55,
    chapters: [
      {
        id: 'ch1',
        title: 'AWS Foundations',
        description: 'Getting started with AWS',
        lessons: [
          { id: 'l1', title: 'AWS Overview', description: 'Understanding AWS services', duration: 18, free: true, content: 'Learn the AWS platform and its core services.', videoUrl: 'https://example.com/v1.mp4', imageUrl: '/aws.png' },
          { id: 'l2', title: 'EC2 Instances', description: 'Compute services', duration: 22, free: true, content: 'Master EC2 for virtual computing in the cloud.', videoUrl: 'https://example.com/v2.mp4', imageUrl: '/ec2.png' },
          { id: 'l3', title: 'S3 Storage', description: 'Object storage service', duration: 20, free: false, content: 'Learn S3 for storing and retrieving data at scale.', videoUrl: 'https://example.com/v3.mp4', imageUrl: '/s3.png' }
        ]
      }
    ]
  },
  {
    id: '8',
    title: 'Mobile App Development',
    description: 'Build native and cross-platform mobile applications.',
    thumbnail: '/hero-learning.png',
    instructor: 'Dr. Sarah Chen',
    institution: 'UC Berkeley',
    level: 'Intermediate',
    category: 'Mobile Development',
    rating: 4.6,
    reviewCount: 6543,
    students: 72000,
    price: 69,
    currency: 'USD',
    duration: 50,
    chapters: [
      {
        id: 'ch1',
        title: 'React Native Basics',
        description: 'Cross-platform mobile development',
        lessons: [
          { id: 'l1', title: 'React Native Setup', description: 'Getting started with React Native', duration: 16, free: true, content: 'Learn how to set up your React Native development environment.', videoUrl: 'https://example.com/v1.mp4', imageUrl: '/rn-setup.png' },
          { id: 'l2', title: 'Components and Props', description: 'Building mobile UI', duration: 20, free: true, content: 'Create reusable components using React Native.', videoUrl: 'https://example.com/v2.mp4', imageUrl: '/rn-comp.png' },
          { id: 'l3', title: 'Navigation', description: 'Moving between screens', duration: 18, free: false, content: 'Implement navigation in mobile apps.', videoUrl: 'https://example.com/v3.mp4', imageUrl: '/rn-nav.png' }
        ]
      }
    ]
  },
  {
    id: '9',
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts, async programming, and modern ES6+.',
    thumbnail: '/hero-learning.png',
    instructor: 'Kyle Simpson',
    institution: 'Frontend Masters',
    level: 'Advanced',
    category: 'Web Development',
    rating: 4.8,
    reviewCount: 11234,
    students: 98000,
    price: 59,
    currency: 'USD',
    duration: 45,
    chapters: [
      {
        id: 'ch1',
        title: 'ES6+ Features',
        description: 'Modern JavaScript syntax',
        lessons: [
          { id: 'l1', title: 'Arrow Functions', description: 'Modern function syntax', duration: 14, free: true, content: 'Learn arrow functions and when to use them.', videoUrl: 'https://example.com/v1.mp4', imageUrl: '/arrow.png' },
          { id: 'l2', title: 'Destructuring', description: 'Extracting values', duration: 16, free: true, content: 'Master array and object destructuring.', videoUrl: 'https://example.com/v2.mp4', imageUrl: '/destructure.png' },
          { id: 'l3', title: 'Async Await', description: 'Asynchronous programming', duration: 20, free: false, content: 'Learn async/await for handling asynchronous operations.', videoUrl: 'https://example.com/v3.mp4', imageUrl: '/async.png' }
        ]
      }
    ]
  },
  {
    id: '10',
    title: 'UX/UI Design Principles',
    description: 'Learn design thinking, user research, and creating beautiful user interfaces.',
    thumbnail: '/hero-learning.png',
    instructor: 'Don Norman',
    institution: 'Nielsen Norman Group',
    level: 'Beginner',
    category: 'Design',
    rating: 4.7,
    reviewCount: 9123,
    students: 110000,
    price: 59,
    currency: 'USD',
    duration: 40,
    chapters: [
      {
        id: 'ch1',
        title: 'Design Fundamentals',
        description: 'Core UX/UI concepts',
        lessons: [
          { id: 'l1', title: 'Design Thinking', description: 'Problem-solving approach', duration: 18, free: true, content: 'Learn the design thinking methodology.', videoUrl: 'https://example.com/v1.mp4', imageUrl: '/dt-thinking.png' },
          { id: 'l2', title: 'User Research', description: 'Understanding users', duration: 20, free: true, content: 'Learn research methods to understand your users.', videoUrl: 'https://example.com/v2.mp4', imageUrl: '/research.png' },
          { id: 'l3', title: 'Wireframing', description: 'Planning layouts', duration: 16, free: false, content: 'Create effective wireframes for your designs.', videoUrl: 'https://example.com/v3.mp4', imageUrl: '/wireframe.png' }
        ]
      }
    ]
  }
]

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id)
}
