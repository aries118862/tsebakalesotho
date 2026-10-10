import { useEffect, useRef } from 'react';
import useEnquiryController from '../controllers/useEnquiryController';
import Icon from './Icon';
import { localizeAttraction, useLanguage } from '../context/LanguageContext';
import countryCallingCodes from '../data/countryCallingCodes';

function EnquiryForm({ selectedDestination, revealKey = 0 }) {
  const { language, t } = useLanguage();
  const formRef = useRef(null);
  const {
    attractions,
    errors,
    form,
    isSubmitted,
    submitEnquiry,
    submittedName,
    today,
    updateField,
  } = useEnquiryController(selectedDestination);

  const fieldClass = (field) => `form-field${errors[field] ? ' form-field--error' : ''}`;

  useEffect(() => {
    const form = formRef.current;
    if (!revealKey || !form) return undefined;

    form.classList.remove('enquiry-form--unwrapping');
    void form.offsetHeight;
    form.classList.add('enquiry-form--unwrapping');
    const timeoutId = window.setTimeout(() => {
      form.classList.remove('enquiry-form--unwrapping');
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [revealKey]);

  return (
    <section className="enquiry" id="enquire">
      <div className="enquiry__inner">
        <div className="enquiry__intro">
          <span className="eyebrow eyebrow--light">{t('YOUR LESOTHO STORY STARTS HERE')}</span>
          <h2>{t('Let’s make it')}<br /><em>{t('a real adventure.')}</em></h2>
          <p>{t('Tell us what you’re dreaming of and we’ll help you find your way around the Mountain Kingdom.')}</p>
          <div className="enquiry__promise"><span><Icon name="check" size={16} /></span>{t('Local tips. No pressure. Just possibilities.')}</div>
          <div className="enquiry__landscape" aria-hidden="true">
            <span className="landscape-sun" />
            <span className="landscape-ridge landscape-ridge--back" />
            <span className="landscape-ridge landscape-ridge--front" />
          </div>
        </div>
        <form ref={formRef} className="enquiry-form" onSubmit={submitEnquiry} noValidate>
          {isSubmitted && (
            <div className="form-success" role="status">
              <span className="form-success__icon"><Icon name="check" size={19} /></span>
              <div><strong>{t('Thanks,')} {submittedName}!</strong><span>{t('Your enquiry is ready. We’ll be in touch soon to help plan your visit.')}</span></div>
            </div>
          )}
          <div className="form-heading"><h3>{t('Plan your visit')}</h3><span>{t('Fields marked * are required')}</span></div>
          <div className="form-grid">
            <label className={fieldClass('fullName')}>{t('Full name *')}
              <input name="fullName" value={form.fullName} onChange={updateField} placeholder={t('Your name')} autoComplete="name" aria-invalid={Boolean(errors.fullName)} />
              {errors.fullName && <span className="field-error">{t(errors.fullName)}</span>}
            </label>
            <label className={fieldClass('email')}>{t('Email address *')}
              <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(errors.email)} />
              {errors.email && <span className="field-error">{t(errors.email)}</span>}
            </label>
            <div className={fieldClass('phone')}>
              <label htmlFor="enquiry-phone">{t('Phone number *')}</label>
              <span className="phone-input-group">
                <select name="countryCode" value={form.countryCode} onChange={updateField} aria-label={t('Country calling code')}>
                  {countryCallingCodes.map(({ name, code }) => (
                    <option key={code} value={`+${code}`}>+{code} — {name}</option>
                  ))}
                </select>
                <input id="enquiry-phone" name="phone" type="tel" inputMode="numeric" value={form.phone} onChange={updateField} placeholder="50000000" autoComplete="tel-national" aria-invalid={Boolean(errors.phone)} />
              </span>
              {errors.phone && <span className="field-error">{t(errors.phone)}</span>}
            </div>
            <label className={fieldClass('destination')}>{t('Destination *')}
              <select name="destination" value={form.destination} onChange={updateField} aria-invalid={Boolean(errors.destination)}>
                <option value="">{t('Choose a place')}</option>
                {attractions.map((place) => <option key={place.id} value={place.name}>{localizeAttraction(place, language).name}</option>)}
              </select>
              {errors.destination && <span className="field-error">{t(errors.destination)}</span>}
            </label>
            <label className={fieldClass('visitors')}>{t('Number of visitors *')}
              <select name="visitors" value={form.visitors} onChange={updateField} aria-invalid={Boolean(errors.visitors)}>
                {Array.from({ length: 20 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {t(index === 0 ? 'visitor' : 'visitors')}</option>)}
              </select>
              {errors.visitors && <span className="field-error">{t(errors.visitors)}</span>}
            </label>
            <label className={fieldClass('visitDate')}>{t('Preferred visit date *')}
              <input name="visitDate" type="date" min={today} value={form.visitDate} onChange={updateField} aria-invalid={Boolean(errors.visitDate)} />
              {errors.visitDate && <span className="field-error">{t(errors.visitDate)}</span>}
            </label>
            <label className={`${fieldClass('message')} form-field--full`}>{t('A little about your trip *')}
              <textarea name="message" value={form.message} onChange={updateField} placeholder={t('What would make this trip unforgettable?')} rows="3" aria-invalid={Boolean(errors.message)} />
              {errors.message && <span className="field-error">{t(errors.message)}</span>}
            </label>
          </div>
          <button className="button form-submit" type="submit">{t('Send your enquiry')} <Icon name="send" size={17} /></button>
        </form>
      </div>
    </section>
  );
}

export default EnquiryForm;
