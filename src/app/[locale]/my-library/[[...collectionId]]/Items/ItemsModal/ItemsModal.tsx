'use client';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  SelectItem,
  SelectSection,
} from '@nextui-org/react';
import { range, sortBy } from 'lodash';
import { useParams } from 'next/navigation';
import { useFormatter, useTranslations } from 'next-intl';
import { ChangeEvent, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

import {
  createCollectionItem,
  updateCollectionItem,
} from '@/app/[locale]/my-library/[[...collectionId]]/Items/actions/actions';
import AuthorInput from '@/app/[locale]/my-library/[[...collectionId]]/Items/ItemsModal/AuthorInput/AuthorInput';
import {
  Field,
  FIELDS,
} from '@/app/[locale]/my-library/[[...collectionId]]/Items/ItemsModal/constants/fields';
import Alert from '@/components/Alert/Alert';
import ButtonFormSubmit from '@/components/ButtonFormSubmit/ButtonFormSubmit';
import Input from '@/components/NextUi/Input/Input';
import Modal from '@/components/NextUi/Modal/Modal';
import Select from '@/components/NextUi/Select/Select';
import Textarea from '@/components/NextUi/Textarea/Textarea';
import { Date as DateType, IData, Person } from '@/types/csl-json';

type ItemsModalProps = {
  onOpenChange: () => void;
  onClose: () => void;
  cslData?: IData;
  itemId?: string;
};

export default function ItemsModal({
  onOpenChange,
  onClose,
  cslData,
  itemId,
}: ItemsModalProps) {
  const t = useTranslations();
  const FEATURED_FIELDS = ['DOI', 'author', 'issued'];
  const isEdit = !!cslData;

  const [additionalFields, setAdditionalFields] = useState<Field[]>(
    !cslData
      ? [FIELDS.find((field) => field.cslType === 'title')!]
      : sortBy(
          FIELDS.filter((field) =>
            Object.keys(cslData).includes(field.cslType)
          ).map((field) => ({
            ...field,
            value:
              field.cslType !== 'custom' ? cslData[field.cslType] : undefined,
          })),
          [(v) => v.cslType !== 'title', 'title']
        )
  );
  const params = useParams<{ collectionId: string }>();
  const format = useFormatter();

  const actionWithId = isEdit
    ? updateCollectionItem.bind(null, itemId ?? '')
    : createCollectionItem.bind(null, params.collectionId?.[0]);

  const [state, formAction] = useFormState(actionWithId, {
    error: '',
    data: {},
    success: false,
  });

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state?.success, onClose]);

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAdditionalFields((prev) => [
      ...prev,
      FIELDS.find((f) => f.cslType === e.target.value)!,
    ]);
  };

  const handleDelete = (value: string) => {
    setAdditionalFields((prev) =>
      prev.filter((field) => field.cslType !== value)
    );
  };

  const fields = FIELDS.filter(
    (field) =>
      !additionalFields.some((_field) => field.cslType === _field.cslType)
  );

  const titleRenderer = (cslKey: keyof IData) => {
    const map: { [key: string]: string } = {
      DOI: 'DOI',
      ISBN: 'ISBN',
      ISSN: 'ISSN',
      PMCID: 'PMCID',
      PMID: 'PMID',
      URL: 'URL',
      abstract: t('gaudy_cuddly_vole_endure'),
      annote: t('white_trite_giraffe_flip'),
      archive: t('raw_patient_sloth_list'),
      'archive-place': t('caring_lost_tiger_hope'),
      archive_location: t('simple_zesty_lion_harbor'),
      authority: t('short_ideal_marten_bask'),
      'call-number': t('smug_ornate_deer_seek'),
      'citation-label': t('red_flaky_butterfly_fond'),
      'citation-number': t('tense_pink_cougar_devour'),
      'collection-title': t('gross_left_panther_dig'),
      'container-title': t('proof_main_felix_nail'),
      'container-title-short': t('lazy_factual_starfish_coax'),
      dimensions: t('each_zesty_cat_dream'),
      event: t('key_crazy_rat_enjoy'),
      'event-place': t('clean_helpful_reindeer_mop'),
      'first-reference-note-number': t('weird_glad_alligator_trip'),
      genre: t('any_upper_chipmunk_advise'),
      journalAbbreviation: t('lost_basic_hornet_gaze'),
      jurisdiction: t('zesty_tidy_skunk_splash'),
      keyword: t('keen_away_angelfish_hope'),
      language: t('keen_tiny_warbler_pray'),
      locator: t('early_kind_iguana_loop'),
      medium: t('novel_caring_pony_find'),
      note: t('safe_tough_squid_roar'),
      number: t('home_upper_jaguar_revive'),
      'original-publisher': t('tidy_white_marlin_support'),
      'original-publisher-place': t('frail_spare_lion_spur'),
      'original-title': t('noisy_petty_swallow_empower'),
      page: t('upper_early_moth_dazzle'),
      'page-first': t('bright_away_anteater_emerge'),
      publisher: t('that_honest_oryx_grin'),
      'publisher-place': t('solid_best_gorilla_offer'),
      references: t('moving_fluffy_turkey_agree'),
      'reviewed-title': t('tidy_fluffy_hornet_bask'),
      scale: t('aware_elegant_duck_fetch'),
      section: t('simple_salty_albatross_hug'),
      shortTitle: t('chunky_fuzzy_ray_shine'),
      source: t('green_early_lemur_link'),
      status: t('sleek_jumpy_niklas_hint'),
      title: t('solid_great_nils_peel'),
      'title-short': t('dizzy_cozy_fireant_quell'),
      version: t('less_slimy_gorilla_fold'),
      'year-suffix': t('this_arable_swan_endure'),
      author: t('alive_seemly_martin_fold'),
      'collection-editor': t('formal_due_frog_dig'),
      composer: t('fit_big_jackal_pray'),
      'container-author': t('orange_pink_ladybug_shine'),
      director: t('these_silly_finch_revive'),
      editor: t('plain_bald_anteater_zip'),
      'editorial-director': t('white_quiet_mole_twirl'),
      illustrator: t('giant_petty_vole_dig'),
      interviewer: t('cute_silly_shad_attend'),
      'original-author': t('spare_real_robin_snap'),
      recipient: t('long_front_tapir_win'),
      'reviewed-author': t('gross_suave_panther_quiz'),
      translator: t('large_direct_turtle_borrow'),
      accessed: t('misty_steep_tuna_cook'),
      container: t('funny_even_hedgehog_splash'),
      'event-date': t('dark_direct_camel_strive'),
      issued: t('vexed_proud_cuckoo_accept'),
      'original-date': t('zany_each_jay_evoke'),
      submitted: t('smart_last_cuckoo_express'),
      'chapter-number': t('frail_zippy_mallard_work'),
      'collection-number': t('lime_male_manatee_work'),
      edition: t('fresh_swift_cuckoo_sing'),
      issue: t('busy_great_grebe_heart'),
      'number-of-pages': t('sour_gray_tuna_tend'),
      'number-of-volumes': t('yummy_big_octopus_adapt'),
      volume: t('alive_fancy_kestrel_win'),
      type: t('topical_this_falcon_gleam'),
    };
    return map[cslKey] || t('nice_ornate_marmot_link');
  };

  const typeRenderer = (type: string) => {
    const map: { [key: string]: string } = {
      article: t('wise_less_shad_stir'),
      'article-journal': t('early_dark_pelican_cherish'),
      'article-magazine': t('bold_muddy_hamster_offer'),
      'article-newspaper': t('left_spicy_seahorse_dine'),
      bill: t('dizzy_tangy_barbel_bump'),
      book: t('mad_bright_lobster_reside'),
      broadcast: t('tangy_upper_chicken_spin'),
      chapter: t('curly_witty_ostrich_jolt'),
      classic: t('real_icy_dog_aspire'),
      collection: t('bald_direct_sawfish_twirl'),
      dataset: t('sound_pretty_wasp_earn'),
      document: t('best_stock_mare_scoop'),
      entry: t('known_aqua_mouse_evoke'),
      'entry-dictionary': t('seemly_helpful_angelfish_sew'),
      'entry-encyclopedia': t('cool_day_javelina_hope'),
      event: t('new_lime_eel_grin'),
      figure: t('empty_careful_meerkat_foster'),
      graphic: t('fair_muddy_piranha_fond'),
      hearing: t('many_white_alpaca_dust'),
      interview: t('tame_giant_mongoose_fetch'),
      legal_case: t('awful_zippy_horse_lift'),
      legislation: t('keen_zesty_leopard_bump'),
      manuscript: t('loose_bland_niklas_hug'),
      map: t('petty_awake_shell_view'),
      motion_picture: t('mild_noble_dove_hint'),
      musical_score: t('slow_neat_mule_learn'),
      pamphlet: t('plane_pink_mallard_beam'),
      'paper-conference': t('antsy_misty_parrot_gasp'),
      patent: t('quiet_known_hyena_cook'),
      performance: t('stout_tame_angelfish_bubble'),
      periodical: t('fresh_icy_otter_belong'),
      personal_communication: t('jolly_kind_butterfly_enjoy'),
      post: t('sea_real_gorilla_fetch'),
      'post-weblog': t('fancy_happy_swallow_read'),
      regulation: t('witty_zesty_niklas_climb'),
      report: t('whole_these_boar_cry'),
      review: t('key_keen_osprey_pause'),
      'review-book': t('fit_wacky_moth_value'),
      software: t('alert_happy_cheetah_fear'),
      song: t('dull_east_cobra_treat'),
      speech: t('simple_civil_larva_splash'),
      standard: t('aloof_formal_hamster_zoom'),
      thesis: t('stout_white_chipmunk_emerge'),
      treaty: t('dull_mushy_insect_fulfill'),
      webpage: t('merry_least_warthog_list'),
    };
    return map[type] || t('silly_keen_firefox_launch');
  };

  return (
    <Modal isOpen onOpenChange={onOpenChange} size="xl">
      <ModalContent>
        <ModalHeader>
          {isEdit
            ? t('dark_bold_alligator_list')
            : t('watery_fuzzy_nils_transform')}
        </ModalHeader>
        <form action={formAction}>
          <ModalBody>
            {state?.error && <Alert color="danger">{state.error}</Alert>}
            {additionalFields.map((field) => (
              <div
                key={field.cslType}
                className="flex border-b-1 border-b-secondary-100 pb-3"
              >
                {field.type === 'string' && (
                  <>
                    {field.cslType === 'abstract' ||
                    field.cslType === 'note' ? (
                      <Textarea
                        label={titleRenderer(field.cslType)}
                        name={field.cslType}
                        type="text"
                        defaultValue={field.value as string}
                      />
                    ) : (
                      <Input
                        label={titleRenderer(field.cslType)}
                        name={field.cslType}
                        type="text"
                        required={field.cslType === 'title'}
                        defaultValue={field.value as string}
                      />
                    )}
                  </>
                )}
                {field.type === 'number' && (
                  <Input
                    label={titleRenderer(field.cslType)}
                    name={field.cslType}
                    type="number"
                    defaultValue={field.value as string}
                  />
                )}
                {field.type === 'select' && (
                  <Select
                    label={titleRenderer(field.cslType)}
                    name={field.cslType}
                    defaultSelectedKeys={[field.value as string]}
                  >
                    {field.options?.map((option) => (
                      <SelectItem value={option} key={option}>
                        {typeRenderer(option)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
                {field.type === 'date' && (
                  <div className="sm:flex grow space-x-0 md:space-x-1 space-y-1 sm:space-y-0">
                    <Select
                      label={
                        titleRenderer(field.cslType) +
                        ' ' +
                        t('red_vivid_turkey_zoom')
                      }
                      name={field.cslType}
                      placeholder={t('big_noisy_wolf_relish')}
                      className="me-1"
                      defaultSelectedKeys={
                        (field?.value as DateType)?.['date-parts']?.[0]?.[1]
                          ? [
                              (field?.value as DateType)?.[
                                'date-parts'
                              ]?.[0]?.[1]?.toString() as string,
                            ]
                          : []
                      }
                    >
                      {range(1, 13).map((number) => (
                        <SelectItem value={number} key={number}>
                          {format.dateTime(new Date(`0000-${number}`), {
                            month: 'long',
                          })}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      label={
                        titleRenderer(field.cslType) +
                        ' ' +
                        t('tired_that_ray_pat')
                      }
                      name={field.cslType}
                      type="number"
                      placeholder={t('flat_last_snail_slurp')}
                      defaultValue={
                        (field?.value as DateType)?.[
                          'date-parts'
                        ]?.[0]?.[0] as string
                      }
                    />
                  </div>
                )}
                {field.type === 'person' && (
                  <div className="bg-secondary-50 rounded-3xl border-1 border-secondary-200 py-2 px-3 grow">
                    <div className="text-[.75rem] text-default-600">
                      {titleRenderer(field.cslType)}
                    </div>
                    <AuthorInput
                      cslType={field.cslType}
                      defaultValue={field.value as Person[]}
                    />
                  </div>
                )}
                <div>
                  {field.cslType !== 'title' && (
                    <Button
                      variant="light"
                      isIconOnly
                      className="text-secondary p-0 mr-[-5px] mt-[-5px]"
                      size="sm"
                      onPress={() => handleDelete(field.cslType)}
                      aria-label={t('still_noble_puma_bump')}
                    >
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        style={{ fontSize: '1.3rem' }}
                      />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </ModalBody>
          <ModalFooter className="flex justify-between items-center">
            <Select
              className="max-w-48"
              size="sm"
              placeholder={t('dry_blue_panther_compose')}
              onChange={handleSelectChange}
              selectedKeys={new Set([])}
            >
              <SelectSection showDivider title={t('next_mad_dachshund_soar')}>
                {fields
                  .filter((field) => FEATURED_FIELDS.includes(field.cslType))
                  .map((field) => (
                    <SelectItem value={field.cslType} key={field.cslType}>
                      {titleRenderer(field.cslType)}
                    </SelectItem>
                  ))}
              </SelectSection>
              <SelectSection title={t('less_dark_crossbill_pout')}>
                {fields
                  .filter((field) => !FEATURED_FIELDS.includes(field.cslType))
                  .map((field) => (
                    <SelectItem value={field.cslType} key={field.cslType}>
                      {titleRenderer(field.cslType)}
                    </SelectItem>
                  ))}
              </SelectSection>
            </Select>
            <ButtonFormSubmit color="primary" type="submit">
              {t('short_soft_iguana_adapt')}
            </ButtonFormSubmit>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
