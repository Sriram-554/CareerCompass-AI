import { SKILLS_LIST, INTERESTS_LIST } from '../recommendationEngine'

function AssessmentForm({
  formData,
  formErrors,
  onChange,
  onSelection,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <section className="form-section">
        <h2>01. Personal Information</h2>

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={onChange}
          aria-invalid={!!formErrors.name}
          aria-describedby={formErrors.name ? 'name-error' : undefined}
        />
        {formErrors.name && (
          <p id="name-error" className="field-error" role="alert">
            {formErrors.name}
          </p>
        )}
      </section>

      <section className="form-section">
        <h2>02. Education Details</h2>

        <label htmlFor="degree">Degree</label>
        <select
          id="degree"
          name="degree"
          value={formData.degree}
          onChange={onChange}
        >
          <option>B.Tech</option>
          <option>B.E</option>
          <option>B.Sc</option>
          <option>BCA</option>
          <option>MCA</option>
          <option>M.Tech</option>
          <option>Other</option>
        </select>

        <label htmlFor="branch">Branch / Specialization</label>
        <input
          id="branch"
          type="text"
          name="branch"
          placeholder="Example: CSE - AI & ML"
          value={formData.branch}
          onChange={onChange}
          aria-invalid={!!formErrors.branch}
          aria-describedby={formErrors.branch ? 'branch-error' : undefined}
        />
        {formErrors.branch && (
          <p id="branch-error" className="field-error" role="alert">
            {formErrors.branch}
          </p>
        )}

        <label htmlFor="year">Current Year</label>
        <select
          id="year"
          name="year"
          value={formData.year}
          onChange={onChange}
          aria-invalid={!!formErrors.year}
          aria-describedby={formErrors.year ? 'year-error' : undefined}
        >
          <option value="">Select your year</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
          <option>Graduate</option>
        </select>
        {formErrors.year && (
          <p id="year-error" className="field-error" role="alert">
            {formErrors.year}
          </p>
        )}
      </section>

      <section className="form-section">
        <h2>03. Technical Skills</h2>
        <p>Select all the skills you currently know.</p>

        <div className="selection-grid">
          {SKILLS_LIST.map(skill => (
            <label className="selection-option" key={skill}>
              <input
                type="checkbox"
                value={skill}
                checked={formData.skills.includes(skill)}
                onChange={(event) => onSelection(event, 'skills')}
              />
              {skill}
            </label>
          ))}
        </div>
        {formErrors.skills && (
          <p className="field-error" role="alert">
            {formErrors.skills}
          </p>
        )}
      </section>

      <section className="form-section">
        <h2>04. Areas of Interest</h2>
        <p>Select the fields you are interested in exploring.</p>

        <div className="selection-grid">
          {INTERESTS_LIST.map(interest => (
            <label className="selection-option" key={interest}>
              <input
                type="checkbox"
                value={interest}
                checked={formData.interests.includes(interest)}
                onChange={(event) => onSelection(event, 'interests')}
              />
              {interest}
            </label>
          ))}
        </div>
        {formErrors.interests && (
          <p className="field-error" role="alert">
            {formErrors.interests}
          </p>
        )}
      </section>

      <section className="form-section">
        <h2>05. Career Preference</h2>

        <label htmlFor="preference">What kind of career interests you most?</label>

        <select
          id="preference"
          name="preference"
          value={formData.preference}
          onChange={onChange}
          aria-invalid={!!formErrors.preference}
          aria-describedby={formErrors.preference ? 'preference-error' : undefined}
        >
          <option value="">Choose your preference</option>
          <option>Software Development</option>
          <option>AI and Machine Learning</option>
          <option>Data Science</option>
          <option>Cybersecurity</option>
          <option>Research and Higher Studies</option>
          <option>Not Sure Yet</option>
        </select>
        {formErrors.preference && (
          <p id="preference-error" className="field-error" role="alert">
            {formErrors.preference}
          </p>
        )}
      </section>

      <button type="submit" className="assessment-submit">
        Submit Assessment →
      </button>
    </form>
  )
}

export default AssessmentForm
