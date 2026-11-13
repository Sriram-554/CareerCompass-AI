/** Free learning resources and checkpoints by career title */
export const roadmapExtras = {
  'Machine Learning Engineer': {
    resources: [
      { title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'Docs' },
      { title: 'freeCodeCamp Machine Learning', url: 'https://www.youtube.com/watch?v=GwIo3gDZHT0', type: 'YouTube' },
      { title: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', type: 'Course' },
      { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', type: 'Practice' },
    ],
    checkpoint: 'Can explain supervised vs unsupervised learning and train a basic model end-to-end.',
  },
  'Web Developer': {
    resources: [
      { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/', type: 'Docs' },
      { title: 'freeCodeCamp Responsive Web Design', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'Course' },
      { title: 'React Docs Learn', url: 'https://react.dev/learn', type: 'Docs' },
      { title: 'JavaScript.info', url: 'https://javascript.info/', type: 'Course' },
    ],
    checkpoint: 'Can build and deploy a responsive multi-page or React app independently.',
  },
  'Data Analyst': {
    resources: [
      { title: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'Course' },
      { title: 'Kaggle Pandas', url: 'https://www.kaggle.com/learn/pandas', type: 'Course' },
      { title: 'freeCodeCamp Data Analysis with Python', url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', type: 'YouTube' },
      { title: 'Storytelling with Data community resources', url: 'https://www.storytellingwithdata.com/', type: 'Guide' },
    ],
    checkpoint: 'Can clean a dataset, query it with SQL, and present insights in a dashboard.',
  },
  'Cybersecurity Analyst': {
    resources: [
      { title: 'TryHackMe', url: 'https://tryhackme.com/', type: 'Practice' },
      { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', type: 'Docs' },
      { title: 'freeCodeCamp Cybersecurity', url: 'https://www.youtube.com/watch?v=U_P23SqJaDc', type: 'YouTube' },
      { title: 'Linux Journey', url: 'https://linuxjourney.com/', type: 'Course' },
    ],
    checkpoint: 'Can explain common threats and complete a basic defensive analysis writeup.',
  },
  'Cloud Engineer': {
    resources: [
      { title: 'AWS Skill Builder free courses', url: 'https://skillbuilder.aws/', type: 'Course' },
      { title: 'Google Cloud Skills Boost', url: 'https://www.cloudskillsboost.google/', type: 'Course' },
      { title: 'Docker Getting Started', url: 'https://docs.docker.com/get-started/', type: 'Docs' },
      { title: 'freeCodeCamp AWS', url: 'https://www.youtube.com/watch?v=ulprqHHWlng', type: 'YouTube' },
    ],
    checkpoint: 'Can deploy a simple service and explain core cloud building blocks.',
  },
  'DevOps Engineer': {
    resources: [
      { title: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions', type: 'Docs' },
      { title: 'Docker Curriculum', url: 'https://docker-curriculum.com/', type: 'Course' },
      { title: 'freeCodeCamp DevOps', url: 'https://www.youtube.com/watch?v=9pZ2xciS8Ss', type: 'YouTube' },
      { title: 'Linux Basics', url: 'https://linuxjourney.com/', type: 'Course' },
    ],
    checkpoint: 'Can containerize an app and set up a basic CI pipeline.',
  },
  'Mobile App Developer': {
    resources: [
      { title: 'Android Developers Guide', url: 'https://developer.android.com/guide', type: 'Docs' },
      { title: 'freeCodeCamp Android Course', url: 'https://www.youtube.com/watch?v=fis26HvvDII', type: 'YouTube' },
      { title: 'Kotlin Docs', url: 'https://kotlinlang.org/docs/home.html', type: 'Docs' },
      { title: 'Material Design', url: 'https://m3.material.io/', type: 'Guide' },
    ],
    checkpoint: 'Can ship a small Android app with navigation and local data storage.',
  },
  'Research Scientist': {
    resources: [
      { title: 'Papers With Code', url: 'https://paperswithcode.com/', type: 'Research' },
      { title: 'Google Scholar', url: 'https://scholar.google.com/', type: 'Research' },
      { title: 'fast.ai Practical DL', url: 'https://www.fast.ai/', type: 'Course' },
      { title: 'Distill.pub', url: 'https://distill.pub/', type: 'Research' },
    ],
    checkpoint: 'Can reproduce a simple experiment and present methods, results, and limits clearly.',
  },
}

export function getRoadmapExtras(careerTitle) {
  return (
    roadmapExtras[careerTitle] || {
      resources: [],
      checkpoint: 'Complete the current stage project and write a short reflection.',
    }
  )
}
