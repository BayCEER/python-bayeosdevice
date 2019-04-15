
try:
    from setuptools import setup
except ImportError:
	from distutils.core import setup 

import os

data_files = []

start_point = os.path.join('bayeosdevice', 'static')
for root, dirs, files in os.walk(start_point):
    root_files = [os.path.join(root, i) for i in files]
    data_files.append((root, root_files))

start_point = os.path.join('bayeosdevice', 'templates')
for root, dirs, files in os.walk(start_point):
    root_files = [os.path.join(root, i) for i in files]
    data_files.append((root, root_files))


setup(name='python-bayeosdevice',
      version='1.2.0',
      classifiers=['Programming Language :: Python'], 
      description='Python BayEOS Device Web Library',
      url='http://github.com/BayCEER/python-bayeosdevice',
      author='Oliver Archner',
      author_email='oliver.archner@uni-bayreuth.de',
      license='GPL2',
      packages=['bayeosdevice'],
      data_files = data_files,
      install_requires=['tornado'])



