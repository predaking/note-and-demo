class Screen(object):
    @property
    def width(self):
        return self._width
    
    @width.setter
    def width(self, val):
        self._width = val

    @property
    def resolution(self):
        return 786432  

# 测试:
s = Screen()
s.width = 1024
s.height = 768
print('resolution =', s.resolution)
if s.resolution == 786432:
    print('测试通过!')
else:
    print('测试失败!')

s.resolution = 123