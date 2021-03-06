import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next/router');
jest.mock('next-auth/client', () => ({
  useSession: () => [null, false],
}));
jest.mock('../../services/stripe');

describe('Home page', () => {
  it('render currectly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: '$15.00' }} />);

    expect(screen.getByText('for $15.00 month')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-prices-id',
      unit_amount: 1500,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-prices-id',
            amount: '$15.00',
          },
        },
      }),
    );
  });
});
