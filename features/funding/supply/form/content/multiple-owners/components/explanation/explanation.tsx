import { vaultTexts } from 'modules/vaults';
import { Description, Title } from './styles';

const { title, list } =
  vaultTexts.actions.supply.banners.multipleOwners.explanation;

export const Explanation = () => {
  return (
    <dl>
      <Title>{title}</Title>
      {list.map((definition) => (
        <Description key={definition}>{definition}</Description>
      ))}
    </dl>
  );
};
