const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({ render: mockRender }));

jest.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

describe('app/main.tsx', () => {
  test('boots the React app into #root', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('@/app/main');

    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById('root'));
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});
