const roadmaps = {
  'Machine Learning Engineer': {
    title: 'Machine Learning Engineer',
    duration: '6–8 Months',
    stages: [
      {
        title: 'Programming Foundations',
        duration: 'Month 1',
        topics: ['Python fundamentals', 'Functions and OOP', 'Data structures'],
        tools: ['Python', 'VS Code'],
        project: 'Build a Student Grade Calculator',
      },
      {
        title: 'Mathematics and Data Analysis',
        duration: 'Month 2',
        topics: ['Linear algebra basics', 'Statistics and probability', 'Data handling'],
        tools: ['NumPy', 'Pandas', 'Matplotlib'],
        project: 'Analyze a Student Performance Dataset',
      },
      {
        title: 'Machine Learning Fundamentals',
        duration: 'Months 3–4',
        topics: ['Supervised learning', 'Unsupervised learning', 'Model evaluation'],
        tools: ['Scikit-learn'],
        project: 'Build a Student Performance Prediction Model',
      },
      {
        title: 'Deep Learning',
        duration: 'Months 5–6',
        topics: ['Neural networks', 'Deep learning basics', 'Model training'],
        tools: ['TensorFlow or PyTorch'],
        project: 'Build an Image Classification Application',
      },
      {
        title: 'Portfolio and Career Preparation',
        duration: 'Months 7–8',
        topics: ['Model deployment', 'GitHub portfolio', 'Interview preparation'],
        tools: ['Git', 'GitHub', 'Streamlit'],
        project: 'Deploy a Complete Machine Learning Project',
      },
    ],
  },

  'Research Scientist': {
    title: 'Research Scientist',
    duration: '6–9 Months',
    stages: [
      {
        title: 'Programming Foundations',
        duration: 'Month 1',
        topics: ['Python', 'Data structures', 'Problem solving'],
        tools: ['Python', 'VS Code'],
        project: 'Build a Scientific Data Calculator',
      },
      {
        title: 'Mathematical Foundations',
        duration: 'Months 2–3',
        topics: ['Linear algebra', 'Probability', 'Statistics'],
        tools: ['NumPy', 'Matplotlib'],
        project: 'Explore a Mathematical Dataset',
      },
      {
        title: 'Research Fundamentals',
        duration: 'Months 4–5',
        topics: ['Reading research papers', 'Research methodology', 'Experimental design'],
        tools: ['Google Scholar', 'Jupyter Notebook'],
        project: 'Reproduce a Simple Published Experiment',
      },
      {
        title: 'Specialization',
        duration: 'Months 6–7',
        topics: ['Machine learning', 'Deep learning', 'Research evaluation'],
        tools: ['PyTorch', 'Scikit-learn'],
        project: 'Implement a Research-Based ML Model',
      },
      {
        title: 'Research Portfolio',
        duration: 'Months 8–9',
        topics: ['Technical documentation', 'Research presentation', 'Higher studies preparation'],
        tools: ['GitHub', 'LaTeX'],
        project: 'Prepare and Present a Mini Research Project',
      },
    ],
  },

  'Data Analyst': {
    title: 'Data Analyst',
    duration: '4–6 Months',
    stages: [
      {
        title: 'Programming Foundations',
        duration: 'Month 1',
        topics: ['Python basics', 'Data structures', 'Problem solving'],
        tools: ['Python'],
        project: 'Build a Simple Data Processing Program',
      },
      {
        title: 'Data Analysis',
        duration: 'Month 2',
        topics: ['Data cleaning', 'Data manipulation', 'Exploratory analysis'],
        tools: ['Pandas', 'NumPy'],
        project: 'Analyze a Real-World Dataset',
      },
      {
        title: 'Database Skills',
        duration: 'Month 3',
        topics: ['SQL queries', 'Joins', 'Aggregation'],
        tools: ['PostgreSQL', 'SQLite'],
        project: 'Create a Student Database Analysis',
      },
      {
        title: 'Visualization',
        duration: 'Month 4',
        topics: ['Charts', 'Dashboards', 'Data storytelling'],
        tools: ['Power BI', 'Matplotlib'],
        project: 'Build a Sales Analytics Dashboard',
      },
      {
        title: 'Portfolio Preparation',
        duration: 'Months 5–6',
        topics: ['Business analysis', 'Portfolio building', 'Interview preparation'],
        tools: ['GitHub', 'Power BI'],
        project: 'Create an End-to-End Data Analytics Project',
      },
    ],
  },

  'Web Developer': {
    title: 'Web Developer',
    duration: '4–6 Months',
    stages: [
      {
        title: 'Web Foundations',
        duration: 'Month 1',
        topics: ['HTML', 'CSS', 'Responsive design'],
        tools: ['VS Code'],
        project: 'Build a Personal Portfolio Website',
      },
      {
        title: 'JavaScript',
        duration: 'Month 2',
        topics: ['Variables', 'Functions', 'DOM manipulation'],
        tools: ['JavaScript'],
        project: 'Build an Interactive To-Do Application',
      },
      {
        title: 'Frontend Development',
        duration: 'Month 3',
        topics: ['React', 'Components', 'State and props'],
        tools: ['React', 'Vite'],
        project: 'Build a Student Dashboard',
      },
      {
        title: 'Backend Foundations',
        duration: 'Month 4',
        topics: ['APIs', 'Server basics', 'Database fundamentals'],
        tools: ['Node.js', 'Express'],
        project: 'Build a Basic Full-Stack Application',
      },
      {
        title: 'Deployment',
        duration: 'Months 5–6',
        topics: ['Testing', 'Deployment', 'Git workflows'],
        tools: ['Git', 'GitHub', 'Vercel'],
        project: 'Deploy a Complete Web Application',
      },
    ],
  },

  'Cybersecurity Analyst': {
    title: 'Cybersecurity Analyst',
    duration: '6 Months',
    stages: [
      {
        title: 'Computer Foundations',
        duration: 'Month 1',
        topics: ['Operating systems', 'Computer networks', 'Linux fundamentals'],
        tools: ['Linux', 'VirtualBox'],
        project: 'Document a Basic Network Setup',
      },
      {
        title: 'Networking',
        duration: 'Month 2',
        topics: ['TCP/IP', 'DNS', 'Network architecture'],
        tools: ['Wireshark'],
        project: 'Analyze Sample Network Traffic',
      },
      {
        title: 'Security Fundamentals',
        duration: 'Month 3',
        topics: ['Authentication', 'Encryption concepts', 'Security principles'],
        tools: ['Linux'],
        project: 'Create a Security Awareness Guide',
      },
      {
        title: 'Security Monitoring',
        duration: 'Months 4–5',
        topics: ['Log analysis', 'Incident response concepts', 'Threat identification'],
        tools: ['SIEM fundamentals'],
        project: 'Analyze a Sample Security Log Dataset',
      },
      {
        title: 'Career Preparation',
        duration: 'Month 6',
        topics: ['Security documentation', 'Case studies', 'Portfolio preparation'],
        tools: ['GitHub'],
        project: 'Prepare a Defensive Security Analysis Report',
      },
    ],
  },

  'Cloud Engineer': {
    title: 'Cloud Engineer',
    duration: '5–7 Months',
    stages: [
      {
        title: 'Programming and Linux',
        duration: 'Month 1',
        topics: ['Python basics', 'Linux commands', 'Networking basics'],
        tools: ['Python', 'Linux'],
        project: 'Build a Basic System Monitoring Script',
      },
      {
        title: 'Cloud Fundamentals',
        duration: 'Month 2',
        topics: ['Cloud computing', 'Virtualization', 'Cloud architecture'],
        tools: ['AWS fundamentals'],
        project: 'Design a Cloud Architecture Diagram',
      },
      {
        title: 'Cloud Services',
        duration: 'Months 3–4',
        topics: ['Storage', 'Compute', 'Cloud networking'],
        tools: ['AWS'],
        project: 'Deploy a Static Website',
      },
      {
        title: 'DevOps Foundations',
        duration: 'Month 5',
        topics: ['Version control', 'Containers', 'CI/CD concepts'],
        tools: ['Git', 'Docker'],
        project: 'Containerize a Small Application',
      },
      {
        title: 'Portfolio',
        duration: 'Months 6–7',
        topics: ['Monitoring', 'Deployment', 'Cloud documentation'],
        tools: ['AWS', 'GitHub'],
        project: 'Deploy a Small Cloud-Based Application',
      },
    ],
  },

  'DevOps Engineer': {
    title: 'DevOps Engineer',
    duration: '5–7 Months',
    stages: [
      {
        title: 'Linux and Scripting',
        duration: 'Month 1',
        topics: ['Linux fundamentals', 'Shell scripting', 'Process and services'],
        tools: ['Linux', 'Bash'],
        project: 'Automate a Server Setup Checklist',
      },
      {
        title: 'Version Control and Collaboration',
        duration: 'Month 2',
        topics: ['Git workflows', 'Branching strategies', 'Code review basics'],
        tools: ['Git', 'GitHub'],
        project: 'Maintain a Sample Project with PR Workflow',
      },
      {
        title: 'Containers',
        duration: 'Month 3',
        topics: ['Docker images', 'Containers', 'Docker Compose'],
        tools: ['Docker'],
        project: 'Containerize a Simple Web Application',
      },
      {
        title: 'CI/CD Pipelines',
        duration: 'Months 4–5',
        topics: ['Pipeline concepts', 'Automated testing', 'Deployment stages'],
        tools: ['GitHub Actions'],
        project: 'Build a CI Pipeline for a Sample App',
      },
      {
        title: 'Monitoring and Reliability',
        duration: 'Months 6–7',
        topics: ['Logging', 'Metrics basics', 'Incident response habits'],
        tools: ['Prometheus basics', 'GitHub'],
        project: 'Document and Demo a Small DevOps Portfolio Project',
      },
    ],
  },

  'Mobile App Developer': {
    title: 'Mobile App Developer',
    duration: '4–6 Months',
    stages: [
      {
        title: 'Programming Foundations',
        duration: 'Month 1',
        topics: ['Java basics', 'OOP', 'Data structures'],
        tools: ['Java', 'Android Studio'],
        project: 'Build a Basic Calculator',
      },
      {
        title: 'Mobile Development',
        duration: 'Month 2',
        topics: ['App components', 'Layouts', 'Navigation'],
        tools: ['Android Studio'],
        project: 'Build a Simple Profile Application',
      },
      {
        title: 'Application Development',
        duration: 'Months 3–4',
        topics: ['User input', 'Local storage', 'API integration'],
        tools: ['Android SDK'],
        project: 'Build a Notes Application',
      },
      {
        title: 'Advanced Concepts',
        duration: 'Month 5',
        topics: ['Application architecture', 'Testing', 'Debugging'],
        tools: ['Android Studio'],
        project: 'Build a Student Management App',
      },
      {
        title: 'Portfolio',
        duration: 'Month 6',
        topics: ['Deployment preparation', 'Documentation', 'Portfolio'],
        tools: ['Git', 'GitHub'],
        project: 'Complete and Document a Mobile Application',
      },
    ],
  },
}

export function getRoadmap(careerTitle) {
  return roadmaps[careerTitle] || null
}
