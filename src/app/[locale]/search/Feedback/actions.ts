'use server';

import ky from 'ky';

export async function submitQuestionSpecificFeedback(
  data: {
    question: string;
    fingerprint: string;
  },
  prevState: unknown,
  formData: FormData
) {
  const QUESTION_MAPPING = {
    helpfulness: 'entry.431283326',
    correctness: 'entry.485547472',
    completeness: 'entry.671939238',
    fingerprint: 'entry.385376961',
    question: 'entry.852181427',
  };
  const googleFormUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSe38QcUPpRENoeHN4l_o4EpA7vWxC-RhfKSVuDhS0o4J91Nyg/formResponse';

  const formBody = new URLSearchParams();
  formBody.append(
    QUESTION_MAPPING.helpfulness,
    (formData.get('helpfulness') as string) ?? ''
  );
  formBody.append(
    QUESTION_MAPPING.correctness,
    (formData.get('correctness') as string) ?? ''
  );
  formBody.append(
    QUESTION_MAPPING.completeness,
    (formData.get('completeness') as string) ?? ''
  );
  formBody.append(QUESTION_MAPPING.question, data.question);
  formBody.append(QUESTION_MAPPING.fingerprint, data.fingerprint);

  try {
    await ky.post(googleFormUrl, {
      body: formBody.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error submitting feedback', error);
    return {
      error: 'Could not submit feedback',
      success: false,
    };
  }
}

export async function submitOrkgGeneralFeedback(
  data: {
    fingerprint: string;
  },
  prevState: unknown,
  formData: FormData
) {
  const QUESTION_MAPPING = {
    fingerprint: 'entry.1131304844',
    satisfaction: 'entry.249698747',
    meetsRequirements: 'entry.1827646521',
    easyToUse: 'entry.1731798542',
    comments: 'entry.1433520924',
  };
  const googleFormUrl =
    'https://docs.google.com/forms/d/e/1FAIpQLSed9fm5UKyHMHgdHga-Ro7DXOhIE_g77eJ2Y39u2-ece_0IfA/formResponse';

  const formBody = new URLSearchParams();
  formBody.append(
    QUESTION_MAPPING.satisfaction,
    (formData.get('satisfaction') as string) ?? ''
  );
  formBody.append(
    QUESTION_MAPPING.meetsRequirements,
    (formData.get('meetsRequirements') as string) ?? ''
  );
  formBody.append(
    QUESTION_MAPPING.easyToUse,
    (formData.get('easyToUse') as string) ?? ''
  );
  formBody.append(
    QUESTION_MAPPING.comments,
    (formData.get('comments') as string) ?? ''
  );
  formBody.append(QUESTION_MAPPING.fingerprint, data.fingerprint);
  console.log('formBody', formBody.toString(), formBody);
  try {
    await ky.post(googleFormUrl, {
      body: formBody.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error submitting feedback', error);
    return {
      error: 'Could not submit feedback',
      success: false,
    };
  }
}
