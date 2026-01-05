import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { render, screen } from '@/test/utils';

import { Button } from './Button';

describe('Button', () => {
  describe('レンダリング', () => {
    it('子要素が正しく表示される', () => {
      render(<Button>クリック</Button>);
      expect(screen.getByRole('button', { name: 'クリック' })).toBeInTheDocument();
    });

    it('デフォルトでtype="button"が設定される', () => {
      render(<Button>テスト</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('type属性が正しく設定される', () => {
      render(<Button type="submit">送信</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });
  });

  describe('スタイル', () => {
    it('primaryバリアントが正しく適用される', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-500');
    });

    it('secondaryバリアントが正しく適用される', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200');
    });

    it('デフォルトでprimaryバリアントが適用される', () => {
      render(<Button>デフォルト</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-500');
    });
  });

  describe('無効化', () => {
    it('disabled属性が正しく設定される', () => {
      render(<Button disabled>無効</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('無効時にクリックイベントが発火しない', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          無効ボタン
        </Button>
      );

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('クリックイベント', () => {
    it('クリック時にonClickが呼ばれる', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>クリック</Button>);

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('複数回クリックで複数回onClickが呼ばれる', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>クリック</Button>);

      const button = screen.getByRole('button');
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });
});
