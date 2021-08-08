using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace JGBTE
{
    public partial class PixelPicker : UserControl
    {
        private int[,] _pixels;


        public PixelPicker()
        {
            InitializeComponent();
            _pixels = new int[8, 8];
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            if (_pixels != null)
            {
                using (var g = e.Graphics)
                {

                    g.Clear(Color.LightBlue);

                    var cellWidth = this.Width / 8;
                    var cellHeight = this.Height / 8;

                    for (int y = 0; y < 8; y++)
                    {
                        for (int x = 0; x < 8; x++)
                        {
                            Brush c = Brushes.White;
                            switch (_pixels[y, x])
                            {
                                case 0:
                                    c = Brushes.White;
                                    break;
                                case 1:
                                    c = Brushes.LightGray;
                                    break;
                                case 2:
                                    c = Brushes.DarkGray;
                                    break;
                                case 3:
                                    c = Brushes.Black;
                                    break;
                            }

                            Rectangle r = new Rectangle { X = cellWidth * x, Y = cellHeight * y, Width = cellWidth - 1, Height = cellHeight - 1 };
                            g.FillRectangle(c, r);
                        }
                    }
                }
            }

            base.OnPaint(e);
        }

        protected override void OnMouseClick(MouseEventArgs e)
        {
            var cellWidth = this.Width / 8;
            var cellHeight = this.Height / 8;

            int x = (int)Math.Floor((decimal)e.X / (decimal)cellWidth);
            int y = (int)Math.Floor((decimal)e.Y / (decimal)cellHeight);

            _pixels[y, x] = _pixels[y, x] + 1;

            if (_pixels[y, x] >3) { _pixels[y, x] = 0; }

            Invalidate();

            base.OnMouseClick(e);
        }


    }
}
